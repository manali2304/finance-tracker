package com.financetracker.backend.service;

import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Get all categories for a user
    public List<Category> getAllCategories(User user) {
        return categoryRepository.findByUser(user);
    }

    // get categories by type
    public List<Category> getCategoriesByType(User user, String type) {
        return  categoryRepository.findByUserAndType(user, type);
    }

    // create category
    public Category createCategory(User user, String name, String type) {

        // validate type
        if (!type.equals("INCOME") && !type.equals("EXPENSE")) {
            throw new RuntimeException("Type must be INCOME or EXPENSE");
        }

        // check if category already exists
        if (categoryRepository.existsByNameAndUser(name, user)) {
            throw new RuntimeException("Category " + name + " already exists");
        }

        // create the category
        Category category = new Category();
        category.setName(name);
        category.setType(type);
        category.setUser(user);

        return categoryRepository.save(category);
    }

    // update category
    public Category updateCategory(Long categoryId, User user, String name, String type) {

        // find category and verify if it belongs to the user
        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // add null checks
        if (name == null || name.isBlank()) {
            throw new RuntimeException("Name is required");
        }

        if (type == null || type.isBlank()) {
            throw new RuntimeException("Type is required");
        }

        if (!type.equals("INCOME") && !type.equals("EXPENSE")) {
            throw new RuntimeException("Type must be INCOME or EXPENSE");
        }

        // check valid type
        if (!type.equals("INCOME") && !type.equals("EXPENSE")) {
            throw new RuntimeException("Type must be INCOME or EXPENSE");
        }

        // check if category name and type exists for the user already
        if (categoryRepository.existsByNameAndTypeAndUser(name, type, user)) {
            throw new RuntimeException("Category " + name + " already exists");
        }

        category.setName(name);
        category.setType(type);

        return categoryRepository.save(category);
    }

    // delete category
    public void deleteCategory(Long categoryId, User user) {
        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        categoryRepository.delete(category);
    }

}
