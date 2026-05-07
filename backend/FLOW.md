#### REGISTRATION FLOW: ####
1. Frontend sends:
   POST /api/auth/register
   Body: { name, email, password }
2. JwtAuthFilter
   → checks for Authorization header
   → no token present (registration is public)
   → filterChain.doFilter() → passes through
3. SecurityConfig
   → checks the route "/api/auth/register"
   → matches "/api/auth/**" → permitAll()
   → no authentication required → continues
4. AuthController (coming next)
   → receives the request
   → validates the request body using @Valid
   → checks @NotBlank, @Email, @Size annotations from RegisterRequest DTO
   → if validation fails → returns 400 Bad Request automatically
   → if validation passes → calls UserService.registerUser()
5. UserService.registerUser()
   → calls userRepository.existsByEmail(email)
   → if email exists → throws RuntimeException("Email already exists")
   → if email doesn't exist → continues
   → encrypts password using BCrypt
   → creates new User object
   → calls userRepository.save(user)
6. UserRepository
   → JPA/Hibernate generates SQL:
   INSERT INTO users (name, email, password, role, created_at)
   VALUES ('John', 'john@gmail.com', '$2a$10$...', 'ROLE_USER', '2026-03-01')
   → saves to PostgreSQL
   → returns saved User object
7. Back in AuthController
   → receives saved User from UserService
   → calls jwtUtil.generateToken(user.getEmail())
   → JWT token created and signed
   → creates AuthResponse(token, name, email)
   → returns 200 OK with AuthResponse
8. Frontend receives:
   {
   "token": "eyJhbGci...",
   "name": "John",
   "email": "john@gmail.com"
   }
   → stores token in localStorage

#### LOGIN FLOW: #### 
1. Frontend sends:
   POST /api/auth/login
   Body: { email, password }
2. JwtAuthFilter
   → no token present
   → passes through
3. SecurityConfig
   → "/api/auth/login" matches "/api/auth/**"
   → permitAll() → continues
4. AuthController
   → receives LoginRequest
   → calls authenticationManager.authenticate()
   → passes email + password
5. AuthenticationManager
   → calls DaoAuthenticationProvider
   → calls UserService.loadUserByUsername(email)
   → UserRepository.findByEmail(email) → fetches user from PostgreSQL
   → BCrypt compares incoming password with stored encrypted password
   → if match → authentication successful ✅
   → if no match → throws BadCredentialsException → 401 Unauthorized
6. Back in AuthController
   → authentication successful
   → finds user by email (UserService.findByEmail())
   → calls jwtUtil.generateToken(email)
   → creates AuthResponse(token, name, email)
   → returns 200 OK
7. Frontend receives:
   {
   "token": "eyJhbGci...",
   "name": "John",
   "email": "john@gmail.com"
   }
   → stores new token

#### PROTECTED REQUEST FLOW (e.g. get transactions): ####
1. Frontend sends:
   GET /api/transactions
   Headers: { Authorization: "Bearer eyJhbGci..." }
2. JwtAuthFilter
   → finds Authorization header ✅
   → extracts token → "eyJhbGci..."
   → extracts email → "john@gmail.com"
   → SecurityContextHolder is empty → null ✅
   → loads user from database (UserService.loadUserByUsername())
   → validates token (JwtUtil.isTokenValid())
   → creates UsernamePasswordAuthenticationToken
   → sets in SecurityContextHolder
   → filterChain.doFilter() → passes through
3. SecurityConfig
   → "/api/transactions" doesn't match "/api/auth/**"
   → anyRequest().authenticated()
   → checks SecurityContextHolder → authenticated ✅
   → continues
4. TransactionController (we'll build this later)
   → receives request
   → gets current user from SecurityContextHolder
   → calls TransactionService
   → fetches transactions from PostgreSQL
   → returns transactions
5. Frontend receives:
   {
   "transactions": [...]
   }