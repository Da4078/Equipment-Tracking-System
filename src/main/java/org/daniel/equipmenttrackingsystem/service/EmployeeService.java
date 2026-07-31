package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.EmployeeRequest;
import org.daniel.equipmenttrackingsystem.dto.EmployeeResponse;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.exception.ResourceNotFoundException;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.daniel.equipmenttrackingsystem.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.UUID;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AssignmentRepository assignmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           AssignmentRepository assignmentRepository) {
        this.employeeRepository = employeeRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest employeeRequest) {
        if (employeeRepository.existsByEmail(employeeRequest.email())) {
            throw new BusinessRuleException("Employee with email '" + employeeRequest.email() + "' already exists");
        }

        Employee employee = employeeRequest.toEntity();
        Employee savedEmployee = employeeRepository.save(employee);

        return EmployeeResponse.fromEntity(savedEmployee);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(UUID id) {
        return employeeRepository.findById(id)
                .map(EmployeeResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Page<EmployeeResponse> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(EmployeeResponse::fromEntity);
    }


    @Transactional
    public EmployeeResponse updateEmployee(UUID id, EmployeeRequest employeeRequest) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        employee.setFirstName(employeeRequest.firstName());
        employee.setLastName(employeeRequest.lastName());
        employee.setEmail(employeeRequest.email());
        employee.setHireDate(employeeRequest.hireDate());
        employee.setDepartment(employeeRequest.department());
        employee.setPosition(employeeRequest.position());
        employee.setActive(employeeRequest.active());

        Employee updatedEmployee = employeeRepository.save(employee);

        return EmployeeResponse.fromEntity(updatedEmployee);
    }

    @Transactional
    public void deleteEmployee(UUID id) {
        employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        if (assignmentRepository.existsByEmployeeIdAndReturnedAtIsNull(id)) {
            throw new BusinessRuleException("Cannot delete employee with active equipment assignments");
        }
        employeeRepository.deleteById(id);
    }
}