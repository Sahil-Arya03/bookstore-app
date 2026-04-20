package com.bookstore.service;

import com.bookstore.dto.InvoiceResponse;
import com.bookstore.entity.Invoice;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.repository.InvoiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceService {

    private static final Logger log = LoggerFactory.getLogger(InvoiceService.class);

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<InvoiceResponse> getAllInvoices() {
        log.debug("Entering getAllInvoices");
        return invoiceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public InvoiceResponse getInvoiceByOrderId(Long orderId) {
        log.debug("Entering getInvoiceByOrderId: orderId={}", orderId);
        Invoice invoice = invoiceRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "orderId", orderId));
        return mapToResponse(invoice);
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
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
