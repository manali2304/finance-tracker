package com.financetracker.backend.controller;

import com.financetracker.backend.dto.AuthResponse;
import com.financetracker.backend.dto.LoginRequest;
import com.financetracker.backend.dto.RegisterRequest;
import com.financetracker.backend.model.User;
import com.financetracker.backend.security.JwtUtil;
import com.financetracker.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // tells Spring this class handles HTTP requests and responses. It automatically converts Java objects to JSON and vice versa
@RequestMapping("/api/auth") // all endpoints in this controller start with `/api/auth`
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    // @Valid — triggers validation annotations on the DTO (@NotBlank, @Email, @Size)
    // @RequestBody tells Spring to take the JSON from the request body and convert it into our DTO object
    public ResponseEntity<AuthResponse> register (@Valid @RequestBody RegisterRequest request) {
        User user = userService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword());

        final String jwtToken = jwtUtil.generateToken(request.getEmail());

        return ResponseEntity.ok(new AuthResponse(jwtToken, user.getName(), user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login (@Valid @RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // compare password
        if (!(passwordEncoder.matches(request.getPassword(), user.getPassword()))) {
            return ResponseEntity.status(401).build();
        }

        final String jwtToken = jwtUtil.generateToken(request.getEmail());

        return ResponseEntity.ok(new AuthResponse(jwtToken, user.getName(), user.getEmail()));
    }

}
