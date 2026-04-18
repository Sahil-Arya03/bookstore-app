package com.bookstore.controller;

import com.bookstore.dto.InvoiceResponse;
import com.bookstore.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for invoice retrieval operations.
 */
@RestController
@RequestMapping("/api/invoices")
@Tag(name = "Invoices", description = "Invoice retrieval endpoints")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    /**
     * Get all invoices (ADMIN only).
     */
    @GetMapping
    @Operation(summary = "Get all invoices (ADMIN)", description = "Returns all invoices in the system")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Invoices retrieved")})
    public ResponseEntity<List<InvoiceResponse>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    /**
     * Get the invoice for a specific order.
     */
    @GetMapping("/{orderId}")
    @Operation(summary = "Get invoice by order ID", description = "Returns the invoice for a specific order")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Invoice found"),
            @ApiResponse(responseCode = "404", description = "Invoice not found")
    })
    public ResponseEntity<InvoiceResponse> getInvoiceByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(invoiceService.getInvoiceByOrderId(orderId));
    }
}
