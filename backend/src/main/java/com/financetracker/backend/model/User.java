package com.financetracker.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

// JPA annotations are read by Hibernate
// Hibernate writes the SQL queries and executes
@Data // automatically generated getters, setter, tostring, hashcode, equals
@NoArgsConstructor // creates a no argument constructor
@AllArgsConstructor // creates an all argument constructor
@Entity // tells hibernate (default JPA provider in Spring Boot) this java class should be mapped to a database table
@Table(name = "users")

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String role;

    // runs before a new record is saved for the first time
    @PrePersist //JPA annotation
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (role == null)
            role = "ROLE_USER"; // default role
    }

}
