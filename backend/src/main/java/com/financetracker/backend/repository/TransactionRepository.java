package com.financetracker.backend.repository;

import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // get all transactions for a user sorted by date newest first
    List<Transaction> findByUserOrderByDateDesc(User user);

    // get transactions by category
    List<Transaction> findByUserAndCategoryOrderByDateDesc(User user, Category category);

    // get transactions between two dates
    List<Transaction> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);

    // get transactions by type (INCOME or EXPENSE)
    List<Transaction> findByUserAndCategory_TypeOrderByDateDesc(User user, String type);

    // find specific transaction by id and user
    Optional<Transaction> findByIdAndUser(Long id, User user);

    long countByUser(User user);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.category.type = 'INCOME'")
    BigDecimal sumIncomeByUser(@Param("user") User user);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.category.type = 'EXPENSE'")
    BigDecimal sumExpenseByUser(@Param("user") User user);

}