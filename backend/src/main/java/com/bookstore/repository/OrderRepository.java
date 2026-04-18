package com.bookstore.repository;

import com.bookstore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Order entity operations.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find all orders placed by a specific user, ordered by most recent.
     * @param userId the user ID
     * @return list of orders for the user
     */
    List<Order> findByUserIdOrderByOrderedAtDesc(Long userId);

    /**
     * Find an order by its order number.
     * @param orderNumber the unique order number
     * @return an Optional containing the order if found
     */
    Optional<Order> findByOrderNumber(String orderNumber);
}
