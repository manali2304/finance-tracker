package com.financetracker.backend.controller;

import com.financetracker.backend.model.Transaction;
import com.financetracker.backend.model.User;
import com.financetracker.backend.service.TransactionService;
import com.financetracker.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final UserService userService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        User user = getCurrentUser();
        return ResponseEntity.ok(transactionService.getAllTransactions(user));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Transaction>> getAllTransactionsByType(@PathVariable String type) {
        User user = getCurrentUser();
        return ResponseEntity.ok(transactionService.getAllTransactionsByType(user, type));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Transaction>> getAllTransactionsByDate(@RequestParam String startDate, @RequestParam String endDate) {
        User user = getCurrentUser();
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return ResponseEntity.ok(transactionService.getTransactionsByDate(user, start, end));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Transaction>> getAllTransactionsByCategory(@PathVariable Long  categoryId) {
        User user = getCurrentUser();
        return ResponseEntity.ok(transactionService.getTransactionsByCategory(user, categoryId));
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody java.util.Map<String, String> request) {
        User user = getCurrentUser();
        Transaction transaction = transactionService.createTransaction(
                user,
                new BigDecimal(request.get("amount")),
                request.get("description"),
                LocalDate.parse(request.get("date")),
                Long.parseLong(request.get("categoryId"))
        );
        return ResponseEntity.status(201).body(transaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        User user = getCurrentUser();
        Transaction transaction = transactionService.updateTransaction(
                user,
                id,
                new BigDecimal(request.get("amount")),
                request.get("description"),
                LocalDate.parse(request.get("date")),
                Long.parseLong(request.get("categoryId"))
        );
        return ResponseEntity.ok(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable Long id) {
        User user = getCurrentUser();
        transactionService.deleteTransaction(user, id);
        return ResponseEntity.ok("Transaction has been deleted");
    }
}
