package org.daniel.equipmenttrackingsystem.controller;

import jakarta.validation.Valid;
import org.daniel.equipmenttrackingsystem.dto.UserRequest;
import org.daniel.equipmenttrackingsystem.dto.UserResponse;
import org.daniel.equipmenttrackingsystem.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(
            @Valid @RequestBody UserRequest request
    ) {
        UserResponse response = userService.createUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}