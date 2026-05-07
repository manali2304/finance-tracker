package com.financetracker.backend.repository;

import com.financetracker.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// JpaRepository gives some free methods that Hibenate reads and executes
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // to check existing email and verify password
    Boolean existsByEmail(String email); // to check if email already exists during registration
}
