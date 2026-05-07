package com.financetracker.backend.controller;

import com.financetracker.backend.dto.DashboardResponse;
import com.financetracker.backend.model.User;
import com.financetracker.backend.service.DashboardService;
import com.financetracker.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserService userService;
    private final DashboardService dashboardService;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {
        User user = getCurrentUser();
        return ResponseEntity.ok(dashboardService.getDashboard(user));
    }
}
