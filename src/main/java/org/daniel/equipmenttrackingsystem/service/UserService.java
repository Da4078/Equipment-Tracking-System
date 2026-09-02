package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.config.JwtService;
import org.daniel.equipmenttrackingsystem.dto.UserRequest;
import org.daniel.equipmenttrackingsystem.dto.UserResponse;
import org.daniel.equipmenttrackingsystem.enums.SignupRole;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.exception.ResourceNotFoundException;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.daniel.equipmenttrackingsystem.model.User;
import org.daniel.equipmenttrackingsystem.repository.EmployeeRepository;
import org.daniel.equipmenttrackingsystem.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UserResponse createUser(UserRequest userRequest) {

        if (userRepository.existsByEmail(userRequest.email())) {
            throw new BusinessRuleException(
                    "User with email '" + userRequest.email() + "' already exists"
            );
        }

        User user = userRequest.toEntity();

        if (userRequest.role() == SignupRole.EMPLOYEE) {

            if (employeeRepository.existsByEmail(userRequest.email())) {
                throw new BusinessRuleException(
                        "Employee with email '" + userRequest.email() + "' already exists"
                );
            }

            validateEmployeeData(userRequest);

            Employee employee = userRequest.toEmployeeEntity();

            Employee savedEmployee =
                    employeeRepository.save(employee);

            user.setEmployee(savedEmployee);
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        User savedUser =
                userRepository.save(user);

        UserDetails userDetails =
                loadUserByUsername(savedUser.getEmail());

        String token =
                jwtService.generateToken(userDetails);

        return UserResponse.fromEntity(
                savedUser,
                token
        );
    }

    private void validateEmployeeData(UserRequest request) {

        if (request.firstName() == null || request.firstName().isBlank()) {
            throw new BusinessRuleException(
                    "First name is required for employees"
            );
        }

        if (request.lastName() == null || request.lastName().isBlank()) {
            throw new BusinessRuleException(
                    "Last name is required for employees"
            );
        }

        if (request.department() == null || request.department().isBlank()) {
            throw new BusinessRuleException(
                    "Department is required for employees"
            );
        }

        if (request.position() == null || request.position().isBlank()) {
            throw new BusinessRuleException(
                    "Position is required for employees"
            );
        }

        if (request.hireDate() == null) {
            throw new BusinessRuleException(
                    "Hire date is required for employees"
            );
        }
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

        user.setEmail(userRequest.email());

        if (userRequest.password() != null
                && !userRequest.password().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(userRequest.password())
            );
        }

        user.setRoles(
                userRequest.toEntity().getRoles()
        );

        User updatedUser =
                userRepository.save(user);

        return UserResponse.fromEntity(updatedUser);
    }

    @Transactional
    public void deleteUser(UUID id) {

        userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: " + id
                        )
                );

        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found with email: " + email
                                )
                        );

        var authorities =
                user.getRoles()
                        .stream()
                        .map(role ->
                                new SimpleGrantedAuthority(
                                        role.name()
                                )
                        )
                        .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
