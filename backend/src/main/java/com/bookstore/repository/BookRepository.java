package com.bookstore.repository;

import com.bookstore.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);

    Boolean existsByIsbn(String isbn);

    Page<Book> findByCategoryId(Long categoryId, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Book> searchBooks(@Param("query") String query, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.category.id = :categoryId AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Book> searchBooksByCategoryId(@Param("categoryId") Long categoryId,
                                        @Param("query") String query,
                                        Pageable pageable);
}
