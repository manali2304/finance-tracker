package com.financetracker.backend.controller;

import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.User;
import com.financetracker.backend.service.CategoryService;
import com.financetracker.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final UserService userService;
    private final CategoryService categoryService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        System.out.println("current user email: " + email);
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        User user = getCurrentUser();
        return ResponseEntity.ok(categoryService.getAllCategories(user));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Category>> getCategoriesByType(@PathVariable String type) {
        User user = getCurrentUser();
        return ResponseEntity.ok(categoryService.getCategoriesByType(user, type));
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody java.util.Map<String, String> request) {
        User user = getCurrentUser();
        Category category = categoryService.createCategory(user, request.get("name"), request.get("type"));
        return ResponseEntity.status(201).body(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        User user = getCurrentUser();
        System.out.println("request: " + request);
        Category category = categoryService.updateCategory(id, user, request.get("name"), request.get("type"));
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{id}")
    // @RequestBody -Spring knows to read it from the request body (JSON)
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        User user = getCurrentUser();
        categoryService.deleteCategory(id, user);
        return ResponseEntity.ok("Category has been deleted");
    }

}


