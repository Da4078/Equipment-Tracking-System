package org.daniel.equipmenttrackingsystem.dto;

import org.daniel.equipmenttrackingsystem.model.Employee;

import java.time.LocalDate;

public record EmployeeRequest(String firstName,
                              String lastName,
                              String email,
                              String department,
                              String position,
                              LocalDate hireDate,
                              boolean active){


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
