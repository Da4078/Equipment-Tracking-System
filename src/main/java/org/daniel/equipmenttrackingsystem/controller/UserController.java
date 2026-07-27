package org.daniel.equipmenttrackingsystem.controller;

import jakarta.validation.Valid;
import org.daniel.equipmenttrackingsystem.dto.UserRequest;
import org.daniel.equipmenttrackingsystem.dto.UserResponse;
import org.daniel.equipmenttrackingsystem.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest userRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createUser(userRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable UUID id,
                                                   @Valid @RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(userService.updateUser(id, userRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}