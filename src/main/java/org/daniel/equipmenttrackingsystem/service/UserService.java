package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.UserRequest;
import org.daniel.equipmenttrackingsystem.dto.UserResponse;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.exception.ResourceNotFoundException;
import org.daniel.equipmenttrackingsystem.model.User;
import org.daniel.equipmenttrackingsystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserResponse createUser(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.email())) {
            throw new BusinessRuleException("User with email '" + userRequest.email() + "' already exists");
        }

        User user = userRequest.toEntity();
        User savedUser = userRepository.save(user);
        return UserResponse.fromEntity(savedUser);
    }

    @Transactional(readOnly = true)
    public Optional<UserResponse> getUserById(UUID id) {
        return userRepository.findById(id).map(UserResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    @Transactional
    public UserResponse updateUser(UUID id, UserRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        user.setFirstName(userRequest.firstName());
        user.setLastName(userRequest.lastName());
        user.setEmail(userRequest.email());

        User updatedUser = userRepository.save(user);

        return UserResponse.fromEntity(updatedUser);
    }

    @Transactional
    public void deleteUser(UUID id) {
        userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        userRepository.deleteById(id);
    }
}