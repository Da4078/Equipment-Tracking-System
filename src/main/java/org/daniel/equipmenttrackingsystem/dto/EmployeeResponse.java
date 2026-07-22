package org.daniel.equipmenttrackingsystem.dto;

import org.daniel.equipmenttrackingsystem.model.Employee;

import java.time.LocalDate;
import java.util.UUID;

public record EmployeeResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String department,
        String position,
        LocalDate hireDate,
        boolean active
) {
    public static EmployeeResponse fromEntity(Employee employee) {
        if (employee == null) {
            return null;
        }
        return new EmployeeResponse(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getDepartment(),
                employee.getPosition(),
                employee.getHireDate(),
                employee.isActive()
        );
    }
}