package com.bookstore.repository;

import com.bookstore.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for Invoice entity operations.
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    /**
     * Find the invoice associated with a specific order.
     * @param orderId the order ID
     * @return an Optional containing the invoice if found
     */
    Optional<Invoice> findByOrderId(Long orderId);
}
