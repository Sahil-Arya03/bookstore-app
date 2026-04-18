package com.bookstore.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for category creation and update requests.
 */
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    // Constructors
    public CategoryRequest() {}

    public CategoryRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
