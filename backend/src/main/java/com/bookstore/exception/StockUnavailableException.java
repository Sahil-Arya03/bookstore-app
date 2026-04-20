package com.bookstore.exception;

/**
 * Exception thrown when there is insufficient stock to fulfill an order.
 */
public class StockUnavailableException extends RuntimeException {

    public StockUnavailableException(String message) {
        super(message);
    }

    public StockUnavailableException(String bookTitle, int requested, int available) {
        super(String.format("We don't have enough copies of '%s' in stock! You asked for %d, but we only have %d available right now.",
                bookTitle, requested, available));
    }
}
