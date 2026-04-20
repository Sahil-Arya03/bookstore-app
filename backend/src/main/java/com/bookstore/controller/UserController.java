package com.bookstore.controller;

import com.bookstore.dto.UserResponse;
import com.bookstore.dto.UserUpdateRequest;
import com.bookstore.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "Get all users (ADMIN)", description = "Returns all registered users")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Users retrieved")})
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/profile")
    @Operation(summary = "Get my profile", description = "Returns the authenticated user's profile")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Profile retrieved")})
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update my profile", description = "Update the authenticated user's profile details")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile updated"),
            @ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UserUpdateRequest request,
                                                       Authentication authentication) {
        return ResponseEntity.ok(userService.updateUserProfile(authentication.getName(), request));
    }
}
