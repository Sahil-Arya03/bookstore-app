package com.bookstore.dto;

import java.time.LocalDateTime;

/**
 * Standard error response DTO for consistent API error formatting.
 */
public class ErrorResponse {

    private int status;
    private String message;
    private String timestamp;

    // Constructors
    public ErrorResponse() {}

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now().toString();
    }

    // Getters and Setters
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
