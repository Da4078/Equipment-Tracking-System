package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.EmployeeDTO;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.daniel.equipmenttrackingsystem.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository){ this.employeeRepository = employeeRepository;}

    public Employee createUser(EmployeeDTO employeeDTO){
        if(employeeRepository.existsByEmail(employeeDTO.getEmail())){
            throw new IllegalArgumentException("User already exists");
        }

        Employee employee = new Employee();
        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setHireDate(employeeDTO.getHireDate());
        employee.setDepartment(employeeDTO.getDepartment());
        employee.setPosition(employeeDTO.getPosition());
        employee.setActive(true);

        return employeeRepository.save(employee);
    }

    public Optional<Employee> getUserById(UUID id){
        return employeeRepository.findById(id);
    }

    public Page<Employee> getAllUsers(Pageable pageable){
        return employeeRepository
                .findAll(pageable);
    }

    public Employee updateUser(UUID id, EmployeeDTO employeeDTO){
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setEmail(employeeDTO.getEmail());
        employee.setHireDate(employeeDTO.getHireDate());
        employee.setDepartment(employeeDTO.getDepartment());
        employee.setPosition(employeeDTO.getPosition());
        employee.setActive(true);

        return employeeRepository.save(employee);

    }

    public void deleteUser(UUID id){
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        employeeRepository.deleteById(id);
    }
}
