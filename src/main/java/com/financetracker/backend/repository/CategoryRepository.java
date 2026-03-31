package com.financetracker.backend.repository;

import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser(User user); // get all categories belonging to a specific user

    List<Category> findByUserAndType(User user, String type); // get categories filtered by type, category type

    Optional<Category> findByIdAndUser(Long id, User user); // get categories only if it exists for a user, category id

    Boolean existsByNameAndUser(String name, User user); // check if a category already exists for a user, category name

    Boolean existsByNameAndTypeAndUser(String name, String type, User user);

}
