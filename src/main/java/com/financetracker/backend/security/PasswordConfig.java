package com.financetracker.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration //registers the CLASS as a bean
public class PasswordConfig {

    /* BEAN Creates ONE BCryptPasswordEncoder instance at startup
    Stores it
    Whenever any class needs PasswordEncoder, Spring gives them the SAME instance*/

    /* BCryptPasswordEncoder — this is the actual encryption algorithm. BCrypt is the industry standard for encrypting passwords. It's very secure because:
   It adds a random **salt** to every password so two identical passwords produce different hashes
   It's intentionally slow to prevent brute force attacks
   It's a **one way hash** meaning you can never decrypt it back to the original password
   */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
