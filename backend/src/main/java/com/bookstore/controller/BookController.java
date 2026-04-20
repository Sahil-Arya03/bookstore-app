package com.bookstore.controller;

import com.bookstore.dto.BookRequest;
import com.bookstore.dto.BookResponse;
import com.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * The public window into our bookstore's inventory!
 * Anyone can browse the books (GET), but only users with an ADMIN badge
 * are allowed to add, edit, or remove books from the shelves (POST/PUT/DELETE).
 */
@RestController
@RequestMapping("/api/books")
@Tag(name = "Books", description = "Book management endpoints")
public class BookController {

    @Autowired
    private BookService bookService;

    /**
     * Get a paginated list of books with optional category filter.
     */
    @GetMapping
    @Operation(summary = "List all books", description = "Returns paginated list of books, optionally filtered by category")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Books retrieved successfully")})
    public ResponseEntity<Page<BookResponse>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(bookService.getAllBooks(page, size, categoryId));
    }

    /**
     * Get a single book by its ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get book by ID", description = "Returns details of a specific book")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book found"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    /**
     * Search books by title, author, or ISBN.
     */
    @GetMapping("/search")
    @Operation(summary = "Search books", description = "Search books by title, author, or ISBN")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Search results returned")})
    public ResponseEntity<Page<BookResponse>> searchBooks(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookService.searchBooks(q, page, size));
    }

    /**
     * Create a new book (ADMIN only).
     */
    @PostMapping
    @Operation(summary = "Create a book (ADMIN)", description = "Add a new book to the inventory")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Book created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "409", description = "Duplicate ISBN")
    })
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody BookRequest request) {
        return new ResponseEntity<>(bookService.createBook(request), HttpStatus.CREATED);
    }

    /**
     * Update an existing book (ADMIN only).
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update a book (ADMIN)", description = "Update an existing book's details")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book updated successfully"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long id, @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }

    /**
     * Delete a book (ADMIN only).
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a book (ADMIN)", description = "Remove a book from the inventory")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Book deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Book not found")
    })
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
