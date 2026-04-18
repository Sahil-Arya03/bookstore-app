package com.bookstore.dto;

import java.util.List;

/**
 * DTO for category data in API responses.
 * Optionally includes the list of books in this category.
 */
public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private List<BookResponse> books;

    // Constructors
    public CategoryResponse() {}

    public CategoryResponse(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<BookResponse> getBooks() { return books; }
    public void setBooks(List<BookResponse> books) { this.books = books; }
}
