package com.financetracker.backend.service;

import com.financetracker.backend.dto.DashboardResponse;
import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardResponse getDashboard(User user) {
        BigDecimal totalIncome = transactionRepository.sumIncomeByUser(user);
        BigDecimal totalExpense = transactionRepository.sumExpenseByUser(user);
        BigDecimal balance = totalIncome.subtract(totalExpense);
        long transactionCount = transactionRepository.countByUser(user);

        return  new DashboardResponse(totalIncome, totalExpense, balance, transactionCount);
    }
}
