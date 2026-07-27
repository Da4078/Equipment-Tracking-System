package org.daniel.equipmenttrackingsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import org.daniel.equipmenttrackingsystem.model.Employee;

import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank(message = "First name is required")
        @Size(max = 50, message = "First name cannot exceed 50 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 50, message = "Last name cannot exceed 50 characters")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email
        String email,

        @Size(max = 100, message = "Department name is too long")
        String department,

        @Size(max = 100, message = "Position title is too long")
        String position,

        @NotNull(message = "Hire date is required")
        @PastOrPresent(message = "Hire date cannot be in the future")
        LocalDate hireDate,

        boolean active
) {

    public Employee toEntity() {
        Employee employee = new Employee();
        employee.setFirstName(this.firstName());
        employee.setLastName(this.lastName());
        employee.setEmail(this.email());
        employee.setDepartment(this.department());
        employee.setPosition(this.position());
        employee.setHireDate(this.hireDate());
        employee.setActive(this.active());
        return employee;
    }
}