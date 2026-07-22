package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.EquipmentDTO;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.model.Equipment;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.daniel.equipmenttrackingsystem.repository.EquipmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final AssignmentRepository assignmentRepository;

    public EquipmentService(EquipmentRepository equipmentRepository,
                            AssignmentRepository assignmentRepository) {
        this.equipmentRepository = equipmentRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public EquipmentDTO createEquipment(EquipmentDTO equipmentDTO){

        if(equipmentRepository.existsBySerialNumber(equipmentDTO.getSerialNumber())){
            throw new IllegalArgumentException("Equipment with this serial number already exists");
        }

        Equipment equipment = equipmentDTO.toEntity();
        Equipment savedEquipment = equipmentRepository.save(equipment);

        return EquipmentDTO.fromEntity(savedEquipment);
    }

    public Optional<EquipmentDTO> getEquipmentById(UUID id){
        return equipmentRepository.findById(id).map(EquipmentDTO::fromEntity);
    }

    public List<EquipmentDTO> getAllEquipment() {
       return equipmentRepository.findAll().stream().map(EquipmentDTO::fromEntity).toList();
    }

    public EquipmentDTO updateEquipment(UUID id, EquipmentDTO equipmentDTO){
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Equipment not found"));

        equipment.setEquipmentName(equipmentDTO.getEquipmentName());
        equipment.setType(equipmentDTO.getType());
        equipment.setBrand(equipmentDTO.getBrand());
        equipment.setModel(equipmentDTO.getModel());
        equipment.setStatus(equipmentDTO.getStatus());

        Equipment updatedEquipment = equipmentRepository.save(equipment);

        return EquipmentDTO.fromEntity(updatedEquipment);
    }

    public void deleteEquipment(UUID id){
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Equipment not found"));

        boolean hasHistory = assignmentRepository.existsByEquipmentId(id);

        if(hasHistory){
            equipment.setStatus(EquipmentStatus.RETIRED);
            equipmentRepository.save(equipment);
        } else {
            equipmentRepository.delete(equipment);
        }
    }
}
