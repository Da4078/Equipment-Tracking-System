package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.config.KeycloakAdminService;
import org.daniel.equipmenttrackingsystem.dto.UserRequest;
import org.daniel.equipmenttrackingsystem.dto.UserResponse;
import org.daniel.equipmenttrackingsystem.enums.UserRole;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.exception.ResourceNotFoundException;
import org.daniel.equipmenttrackingsystem.model.User;
import org.daniel.equipmenttrackingsystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final KeycloakAdminService keycloakAdminService;

    public UserService(
            UserRepository userRepository,
            KeycloakAdminService keycloakAdminService
    ) {
        this.userRepository = userRepository;
        this.keycloakAdminService = keycloakAdminService;
    }

    @Transactional
    public UserResponse createUser(UserRequest userRequest) {

        if (userRepository.existsByEmail(userRequest.email())) {
            throw new BusinessRuleException(
                    "User with email '"
                            + userRequest.email()
                            + "' already exists"
            );
        }

        keycloakAdminService.createAdminUser(userRequest);

        User user = new User();
        user.setEmail(userRequest.email());
        user.setPassword(null);
        user.setRoles(new HashSet<>(Set.of(UserRole.ROLE_ADMIN)));

        User savedUser = userRepository.save(user);

        return UserResponse.fromEntity(savedUser);
    }

    @Transactional(readOnly = true)
    public Optional<UserResponse> getUserById(UUID id) {
        return userRepository.findById(id)
                .map(UserResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Optional<UserResponse> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    @Transactional
    public UserResponse updateUser(
            UUID id,
            UserRequest userRequest
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: " + id
                        )
                );

        String oldEmail = user.getEmail();
        String newEmail = userRequest.email();

        if (!oldEmail.equals(newEmail)
                && userRepository.existsByEmail(newEmail)) {

            throw new BusinessRuleException(
                    "User with email '"
                            + newEmail
                            + "' already exists"
            );
        }

        user.setEmail(newEmail);

        User updatedUser = userRepository.save(user);

        if (user.getEmployee() != null) {
            user.getEmployee().setEmail(newEmail);
        }

        return UserResponse.fromEntity(updatedUser);
    }

    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: " + id
                        )
                );

        userRepository.delete(user);
    }
}