package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.EmployeeDTO;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.daniel.equipmenttrackingsystem.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AssignmentRepository assignmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           AssignmentRepository assignmentRepository){
        this.employeeRepository = employeeRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO){
        if(employeeRepository.existsByEmail(employeeDTO.getEmail())){
            throw new IllegalArgumentException("User already exists");
        }

        Employee employee = employeeDTO.toEntity();
        Employee savedEmployee = employeeRepository.save(employee);

        return EmployeeDTO.fromEntity(savedEmployee);
    }

    public Optional<EmployeeDTO> getEmployeeById(UUID id){
        return employeeRepository.findById(id).map(EmployeeDTO::fromEntity);
    }

    public Page<EmployeeDTO> getAllEmployees(Pageable pageable){
        return employeeRepository.findAll(pageable).map(EmployeeDTO::fromEntity);
    }

    public EmployeeDTO updateEmployee(UUID id, EmployeeDTO employeeDTO){
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setHireDate(employeeDTO.getHireDate());
        employee.setDepartment(employeeDTO.getDepartment());
        employee.setPosition(employeeDTO.getPosition());
        employee.setActive(true);

        Employee updatedEmployee = employeeRepository.save(employee);

        return EmployeeDTO.fromEntity(updatedEmployee);

    }

    public void deleteEmployee(UUID id){
        employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(assignmentRepository.existsByEmployeeIdAndReturnedAtIsNull(id)){
            throw new IllegalStateException("Cannot delete employee");
        }
        employeeRepository.deleteById(id);
    }
}
