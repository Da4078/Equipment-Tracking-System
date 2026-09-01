package org.daniel.equipmenttrackingsystem.controller;

import jakarta.validation.Valid;
import org.daniel.equipmenttrackingsystem.config.JwtService;
import org.daniel.equipmenttrackingsystem.dto.LoginRequest;
import org.daniel.equipmenttrackingsystem.dto.UserRequest;
import org.daniel.equipmenttrackingsystem.dto.UserResponse;
import org.daniel.equipmenttrackingsystem.model.User;
import org.daniel.equipmenttrackingsystem.repository.UserRepository;
import org.daniel.equipmenttrackingsystem.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            UserService userService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
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

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.email(),
                                request.password()
                        )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token =
                jwtService.generateToken(userDetails);

        User user =
                userRepository.findByEmail(request.email())
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found with email: "
                                                + request.email()
                                )
                        );

        return ResponseEntity.ok(
                UserResponse.fromEntity(user, token)
        );
    }
}
