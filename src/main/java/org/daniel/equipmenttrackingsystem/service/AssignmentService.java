package org.daniel.equipmenttrackingsystem.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.model.Assignment;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.daniel.equipmenttrackingsystem.model.Equipment;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.daniel.equipmenttrackingsystem.repository.EmployeeRepository;
import org.daniel.equipmenttrackingsystem.repository.EquipmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final EmployeeRepository employeeRepository;
    private final EquipmentRepository equipmentRepository;


    @Transactional
    public Assignment assignEquipment(UUID employeeId, UUID equipmentId){
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if(!employee.isActive()){
            throw new RuntimeException("Cannot assign equipment to inactive employee");
        }

        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        if(equipment.getStatus() != EquipmentStatus.AVAILABLE){
            throw new RuntimeException("Equipment is not available");
        }

        Assignment assignment = new Assignment();

        assignment.setEmployee(employee);
        assignment.setEquipment(equipment);
        assignment.setAssignedAt(LocalDateTime.now());

        equipment.setStatus(EquipmentStatus.ASSIGNED);

        equipmentRepository.save(equipment);

        return assignmentRepository.save(assignment);
    }

    @Transactional
    public Assignment returnEquipment(UUID assignmentId){
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if(assignment.getReturnedAt() != null){
            throw new RuntimeException("Equipment has already been returned");
        }

        assignment.setReturnedAt(LocalDateTime.now());

        Equipment equipment = assignment.getEquipment();
        equipment.setStatus(EquipmentStatus.AVAILABLE);

        equipmentRepository.save(equipment);

        return assignmentRepository.save(assignment);
    }
}
