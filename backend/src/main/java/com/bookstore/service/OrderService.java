package com.bookstore.service;

import com.bookstore.dto.*;
import com.bookstore.entity.*;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.exception.StockUnavailableException;
import com.bookstore.exception.ValidationException;
import com.bookstore.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service handling order processing including placement, cancellation, and status management.
 * Implements business logic for stock deduction, invoice generation, and access control.
 */
@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    private static final BigDecimal TAX_RATE = new BigDecimal("0.18");

    /**
     * Get all orders (admin only).
     * @return list of OrderResponse DTOs
     */
    public List<OrderResponse> getAllOrders() {
        log.debug("Entering getAllOrders");
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all orders for a specific user.
     * @param userId the user's ID
     * @return list of the user's OrderResponse DTOs
     */
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        log.debug("Entering getOrdersByUserId: userId={}", userId);
        return orderRepository.findByUserIdOrderByOrderedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get order details by ID with access control.
     * @param orderId the order ID
     * @param userEmail the requesting user's email
     * @return OrderResponse DTO
     * @throws AccessDeniedException if the user is not the order owner or admin
     */
    public OrderResponse getOrderById(Long orderId, String userEmail) {
        log.debug("Entering getOrderById: orderId={}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        // Only the order owner or admin can view
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You can only view your own orders");
        }

        return mapToResponse(order);
    }

    /**
     * Place a new order. Deducts stock, calculates totals, and generates invoice.
     * @param request the order details
     * @param userEmail the ordering user's email
     * @return created OrderResponse DTO
     * @throws StockUnavailableException if any book has insufficient stock
     */
    @Transactional
    public OrderResponse placeOrder(OrderRequest request, String userEmail) {
        log.debug("Entering placeOrder for user: {}", userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Order order = new Order();
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setUser(user);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getOrderItems()) {
            Book book = bookRepository.findById(itemRequest.getBookId())
                    .orElseThrow(() -> new ResourceNotFoundException("Book", "id", itemRequest.getBookId()));

            // Check stock availability
            if (book.getStockQuantity() < itemRequest.getQuantity()) {
                throw new StockUnavailableException(book.getTitle(),
                        itemRequest.getQuantity(), book.getStockQuantity());
            }

            // Deduct stock
            book.setStockQuantity(book.getStockQuantity() - itemRequest.getQuantity());
            bookRepository.save(book);

            // Create order item
            BigDecimal subtotal = book.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            OrderItem orderItem = new OrderItem(itemRequest.getQuantity(), book.getPrice(), subtotal, book);
            orderItem.setOrder(order);
            order.getOrderItems().add(orderItem);

            totalAmount = totalAmount.add(subtotal);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Auto-generate invoice with 18% tax
        BigDecimal tax = totalAmount.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal grandTotal = totalAmount.add(tax);

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        invoice.setAmount(totalAmount);
        invoice.setTax(tax);
        invoice.setGrandTotal(grandTotal);
        invoice.setOrder(savedOrder);
        invoiceRepository.save(invoice);

        log.info("Order placed successfully: {} (Total: {}, User: {})",
                savedOrder.getOrderNumber(), totalAmount, userEmail);

        return mapToResponse(savedOrder);
    }

    /**
     * Update the status of an order (admin only).
     * @param orderId the order ID
     * @param status the new status
     * @return updated OrderResponse DTO
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        log.debug("Entering updateOrderStatus: orderId={}, status={}", orderId, status);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid order status: " + status);
        }

        Order updatedOrder = orderRepository.save(order);
        log.info("Order status updated: {} -> {}", updatedOrder.getOrderNumber(), status);
        return mapToResponse(updatedOrder);
    }

    /**
     * Cancel an order. Restores stock quantities for all items.
     * @param orderId the order ID
     * @param userEmail the requesting user's email
     * @throws AccessDeniedException if user is not the owner or admin
     */
    @Transactional
    public void cancelOrder(Long orderId, String userEmail) {
        log.debug("Entering cancelOrder: orderId={}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        // Only owner or admin can cancel
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You can only cancel your own orders");
        }

        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new ValidationException("Order is already cancelled");
        }

        // Restore stock quantities
        for (OrderItem item : order.getOrderItems()) {
            Book book = item.getBook();
            book.setStockQuantity(book.getStockQuantity() + item.getQuantity());
            bookRepository.save(book);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
        log.info("Order cancelled: {} (User: {})", order.getOrderNumber(), userEmail);
    }

    /**
     * Map Order entity to OrderResponse DTO.
     */
    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setStatus(order.getStatus().name());
        response.setTotalAmount(order.getTotalAmount());
        response.setShippingAddress(order.getShippingAddress());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setOrderedAt(order.getOrderedAt());
        response.setUserId(order.getUser().getId());
        response.setUserName(order.getUser().getName());

        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList());
        response.setOrderItems(itemResponses);

        // Include invoice if available
        if (order.getInvoice() != null) {
            response.setInvoice(mapInvoiceToResponse(order.getInvoice()));
        }

        return response;
    }

    /**
     * Map OrderItem entity to OrderItemResponse DTO.
     */
    private OrderItemResponse mapItemToResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setBookId(item.getBook().getId());
        response.setBookTitle(item.getBook().getTitle());
        response.setBookIsbn(item.getBook().getIsbn());
        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setSubtotal(item.getSubtotal());
        return response;
    }

    /**
     * Map Invoice entity to InvoiceResponse DTO.
     */
    private InvoiceResponse mapInvoiceToResponse(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        response.setId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setAmount(invoice.getAmount());
        response.setTax(invoice.getTax());
        response.setGrandTotal(invoice.getGrandTotal());
        response.setIssuedAt(invoice.getIssuedAt());
        response.setOrderId(invoice.getOrder().getId());
        response.setOrderNumber(invoice.getOrder().getOrderNumber());
        return response;
    }
}
