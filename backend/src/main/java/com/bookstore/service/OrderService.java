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

    public List<OrderResponse> getAllOrders() {
        log.debug("Entering getAllOrders");
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        log.debug("Entering getOrdersByUserId: userId={}", userId);
        return orderRepository.findByUserIdOrderByOrderedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId, String userEmail) {
        log.debug("Entering getOrderById: orderId={}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You can only view your own orders");
        }

        return mapToResponse(order);
    }

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

            if (book.getStockQuantity() < itemRequest.getQuantity()) {
                throw new StockUnavailableException(book.getTitle(),
                        itemRequest.getQuantity(), book.getStockQuantity());
            }

            book.setStockQuantity(book.getStockQuantity() - itemRequest.getQuantity());
            bookRepository.save(book);

            BigDecimal subtotal = book.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            OrderItem orderItem = new OrderItem(itemRequest.getQuantity(), book.getPrice(), subtotal, book);
            orderItem.setOrder(order);
            order.getOrderItems().add(orderItem);

            totalAmount = totalAmount.add(subtotal);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

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

    @Transactional
    public void cancelOrder(Long orderId, String userEmail) {
        log.debug("Entering cancelOrder: orderId={}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You can only cancel your own orders");
        }

        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new ValidationException("Order is already cancelled");
        }

        for (OrderItem item : order.getOrderItems()) {
            Book book = item.getBook();
            book.setStockQuantity(book.getStockQuantity() + item.getQuantity());
            bookRepository.save(book);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
        log.info("Order cancelled: {} (User: {})", order.getOrderNumber(), userEmail);
    }

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

        if (order.getInvoice() != null) {
            response.setInvoice(mapInvoiceToResponse(order.getInvoice()));
        }

        return response;
    }

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
