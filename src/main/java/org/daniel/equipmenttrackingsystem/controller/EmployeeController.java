package org.daniel.equipmenttrackingsystem.controller;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.daniel.equipmenttrackingsystem.dto.AssignmentResponse;
import org.daniel.equipmenttrackingsystem.dto.CreateEmployeeRequest;
import org.daniel.equipmenttrackingsystem.dto.EmployeeRequest;
import org.daniel.equipmenttrackingsystem.dto.EmployeeResponse;
import org.daniel.equipmenttrackingsystem.dto.EquipmentResponse;
import org.daniel.equipmenttrackingsystem.service.AssignmentService;
import org.daniel.equipmenttrackingsystem.service.EmployeeService;
import org.daniel.equipmenttrackingsystem.service.EquipmentService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EquipmentService equipmentService;
    private final AssignmentService assignmentService;

    public EmployeeController(
            EmployeeService employeeService,
            EquipmentService equipmentService,
            AssignmentService assignmentService) {

        this.employeeService = employeeService;
        this.equipmentService = equipmentService;
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest employeeRequest) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employeeService.createEmployee(employeeRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(
            @PathVariable UUID id) {

        EmployeeResponse employee = employeeService.getEmployeeById(id);

        return ResponseEntity.ok(employee);
    }

    @GetMapping
    public ResponseEntity<Page<EmployeeResponse>> getAllEmployees(
            @ParameterObject
            @PageableDefault(
                    page = 0,
                    size = 10,
                    sort = "lastName",
                    direction = Sort.Direction.ASC
            )
            Pageable pageable) {

        return ResponseEntity.ok(
                employeeService.getAllEmployees(pageable)
        );
    }

    @GetMapping("/{id}/equipment")
    public ResponseEntity<List<EquipmentResponse>> getEquipmentHeldByEmployee(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                equipmentService.getEquipmentHeldByEmployee(id)
        );
    }

    @GetMapping("/{employeeId}/assignments")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<AssignmentResponse>> getEmployeeAssignments(
            @PathVariable UUID employeeId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentsForEmployee(employeeId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable UUID id,
            @Valid @RequestBody EmployeeRequest employeeRequest) {

        return ResponseEntity.ok(
                employeeService.updateEmployee(id, employeeRequest)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(
            @PathVariable UUID id) {

        employeeService.deleteEmployee(id);

        return ResponseEntity.noContent().build();
    }
}