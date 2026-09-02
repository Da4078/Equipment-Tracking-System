package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.CreateEmployeeRequest;
import org.daniel.equipmenttrackingsystem.dto.EmployeeRequest;
import org.daniel.equipmenttrackingsystem.dto.EmployeeResponse;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.exception.ResourceNotFoundException;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.daniel.equipmenttrackingsystem.model.User;
import org.daniel.equipmenttrackingsystem.enums.UserRole;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.daniel.equipmenttrackingsystem.repository.EmployeeRepository;
import org.daniel.equipmenttrackingsystem.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository,
                           AssignmentRepository assignmentRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {

        // Check employee email
        if (employeeRepository.existsByEmail(request.email())) {
            throw new BusinessRuleException(
                    "Employee with email '" + request.email() + "' already exists"
            );
        }

        // Check user email
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessRuleException(
                    "User with email '" + request.email() + "' already exists"
            );
        }

        Employee employee = new Employee();

        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setEmail(request.email());
        employee.setDepartment(request.department());
        employee.setPosition(request.position());
        employee.setHireDate(request.hireDate());

        employee.setActive(true);

        Employee savedEmployee = employeeRepository.save(employee);

        User user = new User();

        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        user.setRoles(Set.of(UserRole.ROLE_EMPLOYEE));

        user.setEmployee(savedEmployee);

        userRepository.save(user);

        return EmployeeResponse.fromEntity(savedEmployee);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(UUID id) {
        return employeeRepository.findById(id)
                .map(EmployeeResponse::fromEntity)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with ID: " + id
                        )
                );
    }

    @Transactional(readOnly = true)
    public Page<EmployeeResponse> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .map(EmployeeResponse::fromEntity);
    }

    @Transactional
    public EmployeeResponse updateEmployee(
            UUID id,
            EmployeeRequest employeeRequest
    ) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with ID: " + id
                        )
                );

        String oldEmail = employee.getEmail();
        String newEmail = employeeRequest.email();

        if (!oldEmail.equals(newEmail)
                && employeeRepository.existsByEmail(newEmail)) {

            throw new BusinessRuleException(
                    "Employee with email '" + newEmail + "' already exists"
            );
        }

        if (!oldEmail.equals(newEmail)
                && userRepository.existsByEmail(newEmail)) {

            throw new BusinessRuleException(
                    "User with email '" + newEmail + "' already exists"
            );
        }

        employee.setFirstName(employeeRequest.firstName());
        employee.setLastName(employeeRequest.lastName());
        employee.setEmail(newEmail);
        employee.setHireDate(employeeRequest.hireDate());
        employee.setDepartment(employeeRequest.department());
        employee.setPosition(employeeRequest.position());
        employee.setActive(employeeRequest.active());

        Employee updatedEmployee = employeeRepository.save(employee);

        if (!oldEmail.equals(newEmail)) {
            userRepository.findByEmail(oldEmail).ifPresent(user -> {
                user.setEmail(newEmail);
                userRepository.save(user);
            });
        }

        return EmployeeResponse.fromEntity(updatedEmployee);
    }

    @Transactional
    public void deleteEmployee(UUID id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with ID: " + id
                        )
                );

        if (assignmentRepository.existsByEmployeeIdAndReturnedAtIsNull(id)) {
            throw new BusinessRuleException(
                    "Cannot delete employee with active equipment assignments"
            );
        }

        userRepository.findByEmail(employee.getEmail())
                .ifPresent(userRepository::delete);

        employeeRepository.delete(employee);
    }
}