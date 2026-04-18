package com.bookstore.exception;

/**
 * Exception thrown when there is insufficient stock to fulfill an order.
 */
public class StockUnavailableException extends RuntimeException {

    public StockUnavailableException(String message) {
        super(message);
    }

    public StockUnavailableException(String bookTitle, int requested, int available) {
        super(String.format("Insufficient stock for '%s': requested %d, available %d",
                bookTitle, requested, available));
    }
}
