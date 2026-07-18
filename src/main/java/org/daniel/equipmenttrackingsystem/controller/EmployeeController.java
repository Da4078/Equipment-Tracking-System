package org.daniel.equipmenttrackingsystem.controller;

import org.daniel.equipmenttrackingsystem.dto.EmployeeDTO;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.daniel.equipmenttrackingsystem.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/users")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService){this.employeeService = employeeService;}

    @PostMapping
    public ResponseEntity<Employee> createUser(@RequestBody EmployeeDTO employeeDTO){
        return ResponseEntity.ok(employeeService.createUser(employeeDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getUserById(@PathVariable UUID id){
        return employeeService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllUsers(){
        return ResponseEntity.ok(employeeService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateUser(@PathVariable UUID id,
                                               @RequestBody EmployeeDTO employeeDTO){
        return ResponseEntity.ok(employeeService.updateUser(id, employeeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Employee> deleteUser(@PathVariable UUID id){
        employeeService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
