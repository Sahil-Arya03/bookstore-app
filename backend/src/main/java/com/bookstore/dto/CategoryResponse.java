package com.bookstore.dto;

import java.util.List;

public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private List<BookResponse> books;

    public CategoryResponse() {}

    public CategoryResponse(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<BookResponse> getBooks() { return books; }
    public void setBooks(List<BookResponse> books) { this.books = books; }
}
