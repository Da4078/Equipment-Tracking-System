package org.daniel.equipmenttrackingsystem.controller;

import org.daniel.equipmenttrackingsystem.dto.EquipmentDTO;
import org.daniel.equipmenttrackingsystem.model.Equipment;
import org.daniel.equipmenttrackingsystem.service.EquipmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(EquipmentService equipmentService){this.equipmentService = equipmentService;}

    @PostMapping
    public ResponseEntity<EquipmentDTO> createEquipment(@RequestBody EquipmentDTO equipmentDTO){
        return ResponseEntity.ok(equipmentService.createEquipment(equipmentDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<EquipmentDTO>> getEquipment(@PathVariable UUID id){
        return ResponseEntity.ok(equipmentService.getEquipmentById(id));
    }

    @GetMapping
    public ResponseEntity<List<EquipmentDTO>> getEquipment(){
        return ResponseEntity.ok(equipmentService.getAllEquipment());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentDTO> updateEquipment(@PathVariable UUID id,
                                                     @RequestBody EquipmentDTO equipmentDTO){
        return ResponseEntity.ok(equipmentService.updateEquipment(id, equipmentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EquipmentDTO> deleteEquipment(@PathVariable UUID id){
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }
}
