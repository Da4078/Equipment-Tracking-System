package org.daniel.equipmenttrackingsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import org.daniel.equipmenttrackingsystem.enums.SignupRole;
import org.daniel.equipmenttrackingsystem.enums.UserRole;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.daniel.equipmenttrackingsystem.model.User;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

public record UserRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        String password,

        @NotNull(message = "Role is required")
        SignupRole role,

        @Size(max = 50, message = "First name cannot exceed 50 characters")
        String firstName,

        @Size(max = 50, message = "Last name cannot exceed 50 characters")
        String lastName,

        @Size(max = 100, message = "Department name is too long")
        String department,

        @Size(max = 100, message = "Position title is too long")
        String position,

        @PastOrPresent(message = "Hire date cannot be in the future")
        LocalDate hireDate
) {

    public User toEntity() {

        User user = new User();

        user.setEmail(email);
        user.setPassword(password);

        user.setRoles( new HashSet<>(
                switch (role) {
                    case MANAGER -> Set.of(UserRole.ROLE_ADMIN);
                    case EMPLOYEE -> Set.of(UserRole.ROLE_EMPLOYEE);
                })
        );

        return user;
    }

    public Employee toEmployeeEntity() {

        Employee employee = new Employee();

        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setEmail(email);
        employee.setDepartment(department);
        employee.setPosition(position);
        employee.setHireDate(hireDate);
        employee.setActive(true);

        return employee;
    }
}

