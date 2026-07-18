package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.EquipmentDTO;
import org.daniel.equipmenttrackingsystem.model.Equipment;
import org.daniel.equipmenttrackingsystem.repository.EquipmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

    public EquipmentService(EquipmentRepository equipmentRepository) {this.equipmentRepository = equipmentRepository;}

    public Equipment createEquipment(EquipmentDTO equipmentDTO){

        if(equipmentRepository.existsBySerialNumber(equipmentDTO.getSerialNumber())){
            throw new IllegalArgumentException("Equipment with this serial number already exists");
        }

        Equipment equipment = new Equipment();
        equipment.setEquipmentName(equipmentDTO.getEquipmentName());
        equipment.setType(equipmentDTO.getType());
        equipment.setStatus(equipmentDTO.getStatus());
        equipment.setSerialNumber(equipmentDTO.getSerialNumber());

        return equipmentRepository.save(equipment);
    }

    public Equipment getEquipmentById(UUID id){
        return equipmentRepository.findById(id).orElseThrow();
    }

    public List<Equipment> getAllEquipment() {
       return equipmentRepository.findAll();
    }

    public Equipment updateEquipment(UUID id, EquipmentDTO equipmentDTO){
        Equipment equipment = equipmentRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Equipment not found"));

        equipment.setEquipmentName(equipmentDTO.getEquipmentName());
        equipment.setType(equipmentDTO.getType());
        equipment.setStatus(equipmentDTO.getStatus());

        return equipmentRepository.save(equipment);
    }

    public void deleteEquipment(UUID id){
        equipmentRepository.deleteById(id);
    }
}
