package com.bookstore.exception;

/**
 * Exception thrown when authentication fails or unauthorized access is attempted.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
