package com.financetracker.backend.security;
// JWT
// Login → Server verifies password → Server gives JWT token
// Every future request → User sends JWT token → Server trusts them (login will always be authenticated using email+password)

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component //it tells Spring to manage this class as a bean so it can be injected anywhere.
public class JwtUtil {

    //`@Value` — the Spring annotation that says "inject a value here
    //The `${}` means "go look this up from properties"
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    // converts plain secret key into cryptographic key used by JWT
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    //creates a JWT token containing the user's email, issue time, and expiry time, all signed with our secret key.
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            // parseSignedClaims throws exception if token is invalid/tampered/expired
            extractClaims(token);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

    //Claims is the data stored inside the Payload part of the token. In our case the payload contains:
    //json{
    //  "sub": "john@gmail.com",    ← subject (email)
    //  "iat": 1234567890,          ← issued at (when token was created)
    //  "exp": 1234654290           ← expiration (when token expires)
    //}
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token) // checks validity of token
                .getPayload(); // extract the data inside
    }
}
