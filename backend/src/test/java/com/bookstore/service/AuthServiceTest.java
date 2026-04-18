package com.bookstore.service;

import com.bookstore.dto.AuthResponse;
import com.bookstore.dto.LoginRequest;
import com.bookstore.dto.RegisterRequest;
import com.bookstore.entity.User;
import com.bookstore.exception.UnauthorizedException;
import com.bookstore.exception.ValidationException;
import com.bookstore.repository.UserRepository;
import com.bookstore.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService using JUnit 5 and Mockito.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("Test User", "test@test.com", "password123", "1234567890");
        loginRequest = new LoginRequest("test@test.com", "password123");

        testUser = new User("Test User", "test@test.com", "encoded_password", User.Role.USER, "1234567890");
        testUser.setId(1L);
    }

    @Test
    @DisplayName("Register - success")
    void testRegister_success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("test.jwt.token");

        AuthResponse result = authService.register(registerRequest);

        assertNotNull(result);
        assertEquals("test.jwt.token", result.getToken());
        assertEquals("test@test.com", result.getEmail());
        assertEquals("USER", result.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Register - duplicate email throws exception")
    void testRegister_duplicateEmail_throwsException() {
        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        assertThrows(ValidationException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Login - success returns JWT")
    void testLogin_success_returnsJwt() {
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "test@test.com", "encoded_password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("test.jwt.token");

        AuthResponse result = authService.login(loginRequest);

        assertNotNull(result);
        assertEquals("test.jwt.token", result.getToken());
        assertEquals("Test User", result.getName());
    }

    @Test
    @DisplayName("Login - wrong password throws exception")
    void testLogin_wrongPassword_throwsException() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }
}
