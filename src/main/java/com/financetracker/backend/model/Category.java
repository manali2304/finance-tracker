package com.financetracker.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false)
    private String name; // rent, food, travel

    @Column(nullable = false)
    private String type; // SALARY, BUSINESS

    @ManyToOne // Many categories can belong to a single user
    @JoinColumn(name = "user_id", nullable = false) //this creates a `user_id` column in the `categories` table that links to the `users` table:
    private User user;

}

/*
categories table:
        | id | name   | type    | user_id |
        |----|--------|---------|---------|
        | 1  | Salary | INCOME  | 1       | ← belongs to user with id 1
        | 2  | Food   | EXPENSE | 1       | ← belongs to user with id 1 */
