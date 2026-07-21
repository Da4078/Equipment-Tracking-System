package org.daniel.equipmenttrackingsystem.controller;

import org.daniel.equipmenttrackingsystem.dto.AssignEquipmentRequestDTO;
import org.daniel.equipmenttrackingsystem.dto.AssignmentDTO;
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
    public ResponseEntity<AssignmentDTO> assignEquipment(@RequestBody AssignEquipmentRequestDTO requestDTO){
        return ResponseEntity.ok(assignmentService.assignEquipment(
                requestDTO.getEmployeeId(), requestDTO.getEquipmentId()));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<AssignmentDTO> returnEquipment(@PathVariable UUID id){
        return ResponseEntity.ok(assignmentService.returnEquipment(id));
    }
}
