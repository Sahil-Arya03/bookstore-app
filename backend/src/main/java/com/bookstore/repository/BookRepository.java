package com.bookstore.repository;

import com.bookstore.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for Book entity operations.
 * Supports paginated search and category-based filtering.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    /**
     * Find a book by its ISBN.
     * @param isbn the ISBN to search for
     * @return an Optional containing the book if found
     */
    Optional<Book> findByIsbn(String isbn);

    /**
     * Check if a book with the given ISBN already exists.
     * @param isbn the ISBN to check
     * @return true if the ISBN is already registered
     */
    Boolean existsByIsbn(String isbn);

    /**
     * Find books by category with pagination.
     * @param categoryId the category ID to filter by
     * @param pageable pagination parameters
     * @return a page of books in the specified category
     */
    Page<Book> findByCategoryId(Long categoryId, Pageable pageable);

    /**
     * Search books by title, author, or ISBN with pagination.
     * Case-insensitive partial matching is used.
     * @param query the search query
     * @param pageable pagination parameters
     * @return a page of matching books
     */
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Book> searchBooks(@Param("query") String query, Pageable pageable);

    /**
     * Find books by category with search query and pagination.
     * @param categoryId the category ID to filter by
     * @param query the search query
     * @param pageable pagination parameters
     * @return a page of matching books in the specified category
     */
    @Query("SELECT b FROM Book b WHERE b.category.id = :categoryId AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Book> searchBooksByCategoryId(@Param("categoryId") Long categoryId,
                                        @Param("query") String query,
                                        Pageable pageable);
}
