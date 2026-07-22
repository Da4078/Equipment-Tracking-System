package org.daniel.equipmenttrackingsystem.controller;

import org.daniel.equipmenttrackingsystem.dto.AssignEquipmentRequest;
import org.daniel.equipmenttrackingsystem.dto.AssignmentResponse;
import org.daniel.equipmenttrackingsystem.service.AssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService){
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<AssignmentResponse> assignEquipment(@RequestBody AssignEquipmentRequest requestDTO){
        return ResponseEntity.ok(assignmentService.assignEquipment(
                requestDTO.employeeId(), requestDTO.equipmentId()));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<AssignmentResponse> returnEquipment(@PathVariable UUID id){
        return ResponseEntity.ok(assignmentService.returnEquipment(id));
    }
}
