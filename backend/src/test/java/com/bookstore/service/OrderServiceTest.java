package com.bookstore.service;

import com.bookstore.dto.OrderItemRequest;
import com.bookstore.dto.OrderRequest;
import com.bookstore.dto.OrderResponse;
import com.bookstore.entity.*;
import com.bookstore.exception.StockUnavailableException;
import com.bookstore.exception.ValidationException;
import com.bookstore.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for OrderService using JUnit 5 and Mockito.
 */
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InvoiceRepository invoiceRepository;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Book testBook;
    private Category testCategory;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        testUser = new User("Test User", "test@bookstore.com", "password", User.Role.USER, "1234567890");
        testUser.setId(1L);

        testCategory = new Category("Fiction", "Fiction books");
        testCategory.setId(1L);

        testBook = new Book();
        testBook.setId(1L);
        testBook.setTitle("Test Book");
        testBook.setAuthor("Test Author");
        testBook.setIsbn("978-1234567890");
        testBook.setPrice(new BigDecimal("29.99"));
        testBook.setStockQuantity(10);
        testBook.setCategory(testCategory);

        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setOrderNumber("ORD-TEST1234");
        testOrder.setStatus(Order.OrderStatus.PENDING);
        testOrder.setTotalAmount(new BigDecimal("29.99"));
        testOrder.setShippingAddress("123 Test St");
        testOrder.setPaymentMethod("CREDIT_CARD");
        testOrder.setUser(testUser);
        testOrder.setOrderedAt(LocalDateTime.now());

        OrderItem orderItem = new OrderItem(1, new BigDecimal("29.99"), new BigDecimal("29.99"), testBook);
        orderItem.setId(1L);
        orderItem.setOrder(testOrder);
        testOrder.setOrderItems(new ArrayList<>(List.of(orderItem)));

        Invoice invoice = new Invoice("INV-TEST1234", new BigDecimal("29.99"),
                new BigDecimal("5.40"), new BigDecimal("35.39"), testOrder);
        invoice.setId(1L);
        testOrder.setInvoice(invoice);
    }

    @Test
    @DisplayName("Place order - success deducts stock")
    void testPlaceOrder_success_deductsStock() {
        OrderItemRequest itemRequest = new OrderItemRequest(1L, 2);
        OrderRequest request = new OrderRequest(List.of(itemRequest), "123 Test St", "CREDIT_CARD");

        when(userRepository.findByEmail("test@bookstore.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(testOrder.getInvoice());

        OrderResponse result = orderService.placeOrder(request, "test@bookstore.com");

        assertNotNull(result);
        assertEquals(8, testBook.getStockQuantity()); // 10 - 2 = 8
        verify(bookRepository, times(1)).save(any(Book.class));
        verify(invoiceRepository, times(1)).save(any(Invoice.class));
    }

    @Test
    @DisplayName("Place order - insufficient stock throws exception")
    void testPlaceOrder_insufficientStock_throwsException() {
        testBook.setStockQuantity(1);
        OrderItemRequest itemRequest = new OrderItemRequest(1L, 5);
        OrderRequest request = new OrderRequest(List.of(itemRequest), "123 Test St", "CREDIT_CARD");

        when(userRepository.findByEmail("test@bookstore.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        assertThrows(StockUnavailableException.class,
                () -> orderService.placeOrder(request, "test@bookstore.com"));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    @DisplayName("Cancel order - restores stock")
    void testCancelOrder_restoresStock() {
        testBook.setStockQuantity(8);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(userRepository.findByEmail("test@bookstore.com")).thenReturn(Optional.of(testUser));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

        orderService.cancelOrder(1L, "test@bookstore.com");

        assertEquals(9, testBook.getStockQuantity()); // 8 + 1 = 9
        assertEquals(Order.OrderStatus.CANCELLED, testOrder.getStatus());
        verify(bookRepository, times(1)).save(any(Book.class));
    }
}
