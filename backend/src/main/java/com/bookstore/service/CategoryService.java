package com.bookstore.service;

import com.bookstore.dto.BookResponse;
import com.bookstore.dto.CategoryRequest;
import com.bookstore.dto.CategoryResponse;
import com.bookstore.entity.Category;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.exception.ValidationException;
import com.bookstore.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling category CRUD operations.
 */
@Service
public class CategoryService {

    private static final Logger log = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookService bookService;

    /**
     * Get all categories.
     * @return list of CategoryResponse DTOs
     */
    public List<CategoryResponse> getAllCategories() {
        log.debug("Entering getAllCategories");
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a category by ID, including its books.
     * @param id the category ID
     * @return CategoryResponse DTO with book list
     */
    public CategoryResponse getCategoryById(Long id) {
        log.debug("Entering getCategoryById: id={}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        CategoryResponse response = mapToResponse(category);
        List<BookResponse> books = category.getBooks().stream()
                .map(bookService::mapToResponse)
                .collect(Collectors.toList());
        response.setBooks(books);
        return response;
    }

    /**
     * Create a new category.
     * @param request category details
     * @return created CategoryResponse DTO
     */
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        log.debug("Entering createCategory: name={}", request.getName());

        if (categoryRepository.existsByName(request.getName())) {
            throw new ValidationException("Category with name '" + request.getName() + "' already exists");
        }

        Category category = new Category(request.getName(), request.getDescription());
        Category savedCategory = categoryRepository.save(category);
        log.info("Category created: {}", savedCategory.getName());
        return mapToResponse(savedCategory);
    }

    /**
     * Update an existing category.
     * @param id the category ID
     * @param request updated category details
     * @return updated CategoryResponse DTO
     */
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        log.debug("Entering updateCategory: id={}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new ValidationException("Category with name '" + request.getName() + "' already exists");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        Category updatedCategory = categoryRepository.save(category);
        log.info("Category updated: {} (ID: {})", updatedCategory.getName(), id);
        return mapToResponse(updatedCategory);
    }

    /**
     * Delete a category by its ID.
     * @param id the category ID
     */
    @Transactional
    public void deleteCategory(Long id) {
        log.debug("Entering deleteCategory: id={}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        categoryRepository.delete(category);
        log.info("Category deleted: {} (ID: {})", category.getName(), id);
    }

    /**
     * Map Category entity to CategoryResponse DTO (without books).
     */
    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getDescription());
    }
}
