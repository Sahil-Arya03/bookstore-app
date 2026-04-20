package com.bookstore.exception;

import com.bookstore.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler that maps exceptions to appropriate HTTP responses.
 * Provides consistent error response format across all API endpoints.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handle resource not found exceptions (404).
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle validation exceptions from @Valid annotations (400).
     * Returns a map of field-level error messages.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.error("Validation failed: {}", ex.getMessage());
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        response.put("status", 400);
        response.put("errors", errors);
        response.put("timestamp", LocalDateTime.now().toString());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle custom validation exceptions (400).
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex) {
        log.error("Validation error: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle stock unavailable exceptions (400).
     */
    @ExceptionHandler(StockUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleStockUnavailable(StockUnavailableException ex) {
        log.error("Stock unavailable: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle access denied exceptions (403).
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        log.error("Access denied: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(HttpStatus.FORBIDDEN.value(), "You don't have permission to access or modify this resource.");
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    /**
     * Handle authentication exceptions (401).
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication(AuthenticationException ex) {
        log.error("Authentication failed: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), "Oops! Those credentials don't look quite right. Please try logging in again.");
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle unauthorized exceptions (401).
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        log.error("Unauthorized: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle data integrity violations like duplicate entries (409).
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.error("Data integrity violation: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(HttpStatus.CONFLICT.value(),
                "It looks like this information already exists in our system, or there's a conflict preventing us from saving it.");
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    /**
     * Handle all other unhandled exceptions (500).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Internal server error: ", ex);
        ErrorResponse error = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Uh oh! Something went wrong on our end. We're looking into it!");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
