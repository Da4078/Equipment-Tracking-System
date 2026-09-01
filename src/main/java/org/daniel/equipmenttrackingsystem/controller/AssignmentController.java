package org.daniel.equipmenttrackingsystem.controller;

import jakarta.validation.Valid;
import org.daniel.equipmenttrackingsystem.dto.AssignEquipmentRequest;
import org.daniel.equipmenttrackingsystem.dto.AssignmentResponse;
import org.daniel.equipmenttrackingsystem.service.AssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService){
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<AssignmentResponse> assignEquipment(@Valid @RequestBody AssignEquipmentRequest requestDTO){
        return ResponseEntity.ok(assignmentService.assignEquipment(
                requestDTO.employeeId(), requestDTO.equipmentId()));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<AssignmentResponse> returnEquipment(@PathVariable UUID id){
        return ResponseEntity.ok(assignmentService.returnEquipment(id));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<AssignmentResponse>> getEmployeeAssignments(
            @PathVariable UUID employeeId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentsForEmployee(employeeId)
        );
    }

    @GetMapping("/equipment/{equipmentId}/history")
    public ResponseEntity<List<AssignmentResponse>> getEquipmentHistory(
            @PathVariable UUID equipmentId) {

        return ResponseEntity.ok(
                assignmentService.getEquipmentHistory(equipmentId)
        );
    }
}
