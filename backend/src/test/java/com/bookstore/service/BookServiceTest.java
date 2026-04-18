package com.bookstore.service;

import com.bookstore.dto.BookRequest;
import com.bookstore.dto.BookResponse;
import com.bookstore.entity.Book;
import com.bookstore.entity.Category;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.exception.ValidationException;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for BookService using JUnit 5 and Mockito.
 */
@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private BookService bookService;

    private Book testBook;
    private Category testCategory;
    private BookRequest testBookRequest;

    @BeforeEach
    void setUp() {
        testCategory = new Category("Fiction", "Fiction books");
        testCategory.setId(1L);

        testBook = new Book();
        testBook.setId(1L);
        testBook.setTitle("Test Book");
        testBook.setAuthor("Test Author");
        testBook.setIsbn("978-1234567890");
        testBook.setPrice(new BigDecimal("29.99"));
        testBook.setStockQuantity(10);
        testBook.setCategory(testCategory);

        testBookRequest = new BookRequest();
        testBookRequest.setTitle("New Book");
        testBookRequest.setAuthor("New Author");
        testBookRequest.setIsbn("978-0987654321");
        testBookRequest.setPrice(new BigDecimal("19.99"));
        testBookRequest.setStockQuantity(5);
        testBookRequest.setCategoryId(1L);
    }

    @Test
    @DisplayName("Get all books - success")
    void testGetAllBooks_success() {
        Page<Book> bookPage = new PageImpl<>(List.of(testBook));
        when(bookRepository.findAll(any(Pageable.class))).thenReturn(bookPage);

        Page<BookResponse> result = bookService.getAllBooks(0, 10, null);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Book", result.getContent().get(0).getTitle());
        verify(bookRepository, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("Get book by ID - not found throws exception")
    void testGetBookById_notFound_throwsException() {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> bookService.getBookById(999L));
        verify(bookRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Create book - success")
    void testCreateBook_success() {
        when(bookRepository.existsByIsbn(anyString())).thenReturn(false);
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.of(testCategory));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        BookResponse result = bookService.createBook(testBookRequest);

        assertNotNull(result);
        assertEquals("Test Book", result.getTitle());
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    @DisplayName("Create book - duplicate ISBN throws exception")
    void testCreateBook_duplicateIsbn_throwsException() {
        when(bookRepository.existsByIsbn(anyString())).thenReturn(true);

        assertThrows(ValidationException.class, () -> bookService.createBook(testBookRequest));
        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    @DisplayName("Delete book - success")
    void testDeleteBook_success() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        doNothing().when(bookRepository).delete(any(Book.class));

        assertDoesNotThrow(() -> bookService.deleteBook(1L));
        verify(bookRepository, times(1)).delete(testBook);
    }
}
