package com.bookstore.exception;

/**
 * Exception thrown when a requested resource is not found in the database.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("We couldn't find the %s you're looking for with %s: '%s'. It might have been removed or deleted.", resourceName, fieldName, fieldValue));
    }
}
