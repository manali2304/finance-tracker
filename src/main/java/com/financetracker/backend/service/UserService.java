package com.financetracker.backend.service;

import com.financetracker.backend.model.User;
import com.financetracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor // automatically generates a constructor of the class having final fields
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    // UserDetailsService is an interface, no loadUserByUsername implementation exists, so we create one
    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getName())
                .password(user.getPassword())
                .authorities(user.getRole())
                .build();
    }

    // new registration
    public User registerUser(String name, String email, String password) {
        if (userRepository.existsByEmail(email))
            throw new RuntimeException("Email already exists");

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        return userRepository.save(user);
    }

    // usual login
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
