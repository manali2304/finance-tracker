# Finance Tracker Backend Notes

## Project Structure
- model → database tables
- repository → database operations
- service → business logic
- controller → handles HTTP requests
- dto → data in/out of API
- security → JWT and authentication

## API Endpoints
- POST /api/auth/register → register new user
- POST /api/auth/login → login user

## Database
- Database name: finance_tracker
- Port: 5432

## JWT
- Expiry: 24 hours (86400000ms)
- Secret: stored in application.properties


## STRUCTURE
 
com.financetracker.backend
├── model/
│   └── User.java
├── repository/
│   └── UserRepository.java
├── service/
│   └── UserService.java
├── controller/   
|   └── AuthController.java
├── dto/
│   ├── RegisterRequest.java
│   ├── LoginRequest.java
│   └── AuthResponse.java
├── security/
│   ├── SecurityConfig.java
│   ├── JwtUtil.java
│   └── JwtAuthFilter.java
└── BackendApplication.java

###### What each file does: ######

## User.java (Model)
Represents the users table in PostgreSQL. Contains id, name, email, password, role, createdAt. 
Hibernate automatically creates this table when the app starts.

## UserRepository.java (Repository)
Communicates with the database. Gives us findByEmail() and existsByEmail() for free using Spring Data JPA naming conventions. 
Also inherits save(), findAll(), deleteById() etc from JpaRepository.

## UserService.java (Service)
Contains all business logic:

registerUser() — checks if email exists, encrypts password, saves user
loadUserByUsername() — loads user from database for Spring Security
findByEmail() — finds user by email

## RegisterRequest.java (DTO)
Defines what data comes IN during registration — name, email, password with validation annotations like @NotBlank, @Email, @Size.
## LoginRequest.java (DTO)
Defines what data comes IN during login — email and password.
## AuthResponse.java (DTO)
Defines what data goes OUT after register/login — token, name, email.

## JwtUtil.java (Security)
Handles everything JWT related:

generateToken() — creates a JWT token containing email
extractEmail() — reads email from token
isTokenValid() — checks if token is genuine and not expired

## JwtAuthFilter.java (Security)
Intercepts every HTTP request:

Extracts token from Authorization header
Validates token
Loads user from database
Sets authentication in SecurityContextHolder
Passes request to controller

## SecurityConfig.java (Security)
Wires everything together:

/api/auth/** routes are public
All other routes require JWT token
Stateless session (no server side sessions)
Registers JwtAuthFilter in the filter chain
Configures AuthenticationProvider for login

## AuthController.java
one destination that takes in all paths of /api/auth**
checks if the request body is valid
extracts the user details
register/login the user
create jwt token
returns the user details and token back to the client