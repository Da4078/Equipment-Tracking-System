package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.EquipmentRequest;
import org.daniel.equipmenttrackingsystem.dto.EquipmentResponse;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.exception.ResourceNotFoundException;
import org.daniel.equipmenttrackingsystem.model.Equipment;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.daniel.equipmenttrackingsystem.repository.EquipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    @Transactional
    public EquipmentResponse createEquipment(EquipmentRequest equipmentRequest) {
        if (equipmentRepository.existsBySerialNumber(equipmentRequest.serialNumber())) {
            throw new BusinessRuleException("Equipment with serial number '" + equipmentRequest.serialNumber() + "' already exists");
        }

        Equipment equipment = equipmentRequest.toEntity();
        Equipment savedEquipment = equipmentRepository.save(equipment);

        return EquipmentResponse.fromEntity(savedEquipment);
    }

    @Transactional(readOnly = true)
    public EquipmentResponse getEquipmentById(UUID id) {
        return equipmentRepository.findById(id)
                .map(EquipmentResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<EquipmentResponse> getAllEquipment() {
        return equipmentRepository.findAll().stream()
                .map(EquipmentResponse::fromEntity)
                .toList();
    }

    @Transactional
    public EquipmentResponse updateEquipment(UUID id, EquipmentRequest equipmentRequest) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + id));

        equipment.setEquipmentName(equipmentRequest.equipmentName());
        equipment.setType(equipmentRequest.type());
        equipment.setBrand(equipmentRequest.brand());
        equipment.setModel(equipmentRequest.model());

        Equipment updatedEquipment = equipmentRepository.save(equipment);

        return EquipmentResponse.fromEntity(updatedEquipment);
    }

    @Transactional
    public void deleteEquipment(UUID id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + id));

        boolean hasHistory = assignmentRepository.existsByEquipmentId(id);

        if (hasHistory) {
            equipment.setStatus(EquipmentStatus.RETIRED);
            equipmentRepository.save(equipment);
        } else {
            equipmentRepository.delete(equipment);
        }
    }
}