package com.financetracker.backend.service;

import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.CategoryRepository;
import com.financetracker.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public List<Transaction> getAllTransactions(User user) {
        return transactionRepository.findByUserOrderByDateDesc(user);
    }
    // get all transactions for a category and user
    public List<Transaction> getAllTransactionsByType(User user, String type) {
        if (!type.equals("INCOME") && !type.equals("EXPENSE")) {
            throw new RuntimeException("Type must be INCOME or EXPENSE");
        }
        return transactionRepository.findByUserAndCategory_TypeOrderByDateDesc(user, type);
    }

    public List<Transaction> getTransactionsByDate(User user, LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new RuntimeException("Start date must be before end date");
        }
        return transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
    }

    public List<Transaction> getTransactionsByCategory(User user, Long categoryId) {
        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return transactionRepository.findByUserAndCategoryOrderByDateDesc(user, category);
    }

    // create a transaction
    public Transaction createTransaction(User user, BigDecimal amount, String description, LocalDate date, Long categoryId) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than zero");
        }
        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setDate(date);
        transaction.setCategory(category);

        return transactionRepository.save(transaction);
    }

    // update a transaction
    public Transaction updateTransaction(User user, Long transactionId, BigDecimal amount, String description, LocalDate date, Long categoryId) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than zero");
        }
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        Category category = categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setDate(date);
        transaction.setCategory(category);

        return transactionRepository.save(transaction);
    }

    // delete a transaction
    public void deleteTransaction(User user, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transactionRepository.delete(transaction);
    }
}
