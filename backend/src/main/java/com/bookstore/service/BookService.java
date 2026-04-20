package com.bookstore.service;

import com.bookstore.dto.BookRequest;
import com.bookstore.dto.BookResponse;
import com.bookstore.entity.Book;
import com.bookstore.entity.Category;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.exception.ValidationException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService {

    private static final Logger log = LoggerFactory.getLogger(BookService.class);

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<BookResponse> getAllBooks(int page, int size, Long categoryId) {
        log.debug("Entering getAllBooks: page={}, size={}, categoryId={}", page, size, categoryId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Book> books;
        if (categoryId != null) {
            books = bookRepository.findByCategoryId(categoryId, pageable);
        } else {
            books = bookRepository.findAll(pageable);
        }

        return books.map(this::mapToResponse);
    }

    public BookResponse getBookById(Long id) {
        log.debug("Entering getBookById: id={}", id);
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));
        return mapToResponse(book);
    }

    public Page<BookResponse> searchBooks(String query, int page, int size) {
        log.debug("Entering searchBooks: query={}", query);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Book> books = bookRepository.searchBooks(query, pageable);
        return books.map(this::mapToResponse);
    }

    @Transactional
    public BookResponse createBook(BookRequest request) {
        log.debug("Entering createBook: isbn={}", request.getIsbn());

        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new ValidationException("Book with ISBN '" + request.getIsbn() + "' already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        Book book = new Book();
        mapToEntity(request, book, category);
        Book savedBook = bookRepository.save(book);

        log.info("Book created successfully: {} (ISBN: {})", savedBook.getTitle(), savedBook.getIsbn());
        return mapToResponse(savedBook);
    }

    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        log.debug("Entering updateBook: id={}", id);

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));

        if (!book.getIsbn().equals(request.getIsbn()) && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new ValidationException("Book with ISBN '" + request.getIsbn() + "' already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        mapToEntity(request, book, category);
        Book updatedBook = bookRepository.save(book);

        log.info("Book updated successfully: {} (ID: {})", updatedBook.getTitle(), updatedBook.getId());
        return mapToResponse(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        log.debug("Entering deleteBook: id={}", id);
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));
        bookRepository.delete(book);
        log.info("Book deleted successfully: {} (ID: {})", book.getTitle(), id);
    }

    public BookResponse mapToResponse(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setTitle(book.getTitle());
        response.setAuthor(book.getAuthor());
        response.setIsbn(book.getIsbn());
        response.setDescription(book.getDescription());
        response.setPrice(book.getPrice());
        response.setStockQuantity(book.getStockQuantity());
        response.setCoverImageUrl(book.getCoverImageUrl());
        response.setPublicationYear(book.getPublicationYear());
        response.setPublisher(book.getPublisher());
        response.setLanguage(book.getLanguage());
        response.setPageCount(book.getPageCount());
        response.setCategoryId(book.getCategory().getId());
        response.setCategoryName(book.getCategory().getName());
        response.setCreatedAt(book.getCreatedAt());
        response.setUpdatedAt(book.getUpdatedAt());
        return response;
    }

    private void mapToEntity(BookRequest request, Book book, Category category) {
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setStockQuantity(request.getStockQuantity());
        book.setCoverImageUrl(request.getCoverImageUrl());
        book.setPublicationYear(request.getPublicationYear());
        book.setPublisher(request.getPublisher());
        book.setLanguage(request.getLanguage());
        book.setPageCount(request.getPageCount());
        book.setCategory(category);
    }
}
