package com.bookstore.controller;

import com.bookstore.dto.OrderRequest;
import com.bookstore.dto.OrderResponse;
import com.bookstore.entity.User;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for order management operations.
 * Handles order placement, viewing, status updates, and cancellation.
 */
@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order management endpoints")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all orders (ADMIN only).
     */
    @GetMapping
    @Operation(summary = "Get all orders (ADMIN)", description = "Returns all orders in the system")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Orders retrieved")})
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * Get current user's orders.
     */
    @GetMapping("/my")
    @Operation(summary = "Get my orders", description = "Returns all orders for the authenticated user")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Orders retrieved")})
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", authentication.getName()));
        return ResponseEntity.ok(orderService.getOrdersByUserId(user.getId()));
    }

    /**
     * Get order details by ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Returns details of a specific order")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Order found"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrderById(id, authentication.getName()));
    }

    /**
     * Place a new order.
     */
    @PostMapping
    @Operation(summary = "Place an order", description = "Create a new order with items, deducts stock, generates invoice")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Order placed successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error or insufficient stock")
    })
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest request,
                                                     Authentication authentication) {
        return new ResponseEntity<>(orderService.placeOrder(request, authentication.getName()), HttpStatus.CREATED);
    }

    /**
     * Update order status (ADMIN only).
     */
    @PutMapping("/{id}/status")
    @Operation(summary = "Update order status (ADMIN)", description = "Update the status of an order")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status updated"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id,
                                                            @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.get("status")));
    }

    /**
     * Cancel an order.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel an order", description = "Cancel an order and restore stock")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Order cancelled"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id, Authentication authentication) {
        orderService.cancelOrder(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
