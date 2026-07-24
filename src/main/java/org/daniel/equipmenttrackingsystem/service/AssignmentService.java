package org.daniel.equipmenttrackingsystem.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.daniel.equipmenttrackingsystem.dto.AssignmentResponse;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.exception.ResourceNotFoundException;
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

    private AssignmentResponse mapToDto(Assignment assignment) {
        if (assignment == null) {
            return null;
        }

        UUID employeeId = null;
        String employeeName = null;

        if (assignment.getEmployee() != null) {
            employeeId = assignment.getEmployee().getId();
            employeeName = assignment.getEmployee().getFirstName() + " " + assignment.getEmployee().getLastName();
        }

        UUID equipmentId = null;
        String equipmentName = null;

        if (assignment.getEquipment() != null) {
            equipmentId = assignment.getEquipment().getId();
            equipmentName = assignment.getEquipment().getEquipmentName();
        }

        return new AssignmentResponse(
                assignment.getId(),
                employeeId,
                employeeName,
                equipmentId,
                equipmentName,
                assignment.getAssignedAt(),
                assignment.getReturnedAt()
        );
    }

    @Transactional
    public AssignmentResponse assignEquipment(UUID employeeId, UUID equipmentId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        if (!employee.isActive()) {
            throw new BusinessRuleException("Cannot assign equipment to inactive employee");
        }

        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with ID: " + equipmentId));

        if (equipment.getStatus() == EquipmentStatus.RETIRED) {
            throw new BusinessRuleException("Cannot assign equipment that is retired");
        }
        if (equipment.getStatus() != EquipmentStatus.AVAILABLE) {
            throw new BusinessRuleException("Equipment is not available for assignment");
        }

        Assignment assignment = new Assignment();
        assignment.setEmployee(employee);
        assignment.setEquipment(equipment);
        assignment.setAssignedAt(LocalDateTime.now());

        equipment.setStatus(EquipmentStatus.ASSIGNED);
        equipmentRepository.save(equipment);

        Assignment saved = assignmentRepository.save(assignment);

        return mapToDto(saved);
    }

    @Transactional
    public AssignmentResponse returnEquipment(UUID assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with ID: " + assignmentId));

        if (assignment.getReturnedAt() != null) {
            throw new BusinessRuleException("Equipment has already been returned");
        }

        assignment.setReturnedAt(LocalDateTime.now());

        Equipment equipment = assignment.getEquipment();
        equipment.setStatus(EquipmentStatus.AVAILABLE);

        equipmentRepository.save(equipment);

        Assignment saved = assignmentRepository.save(assignment);

        return mapToDto(saved);
    }
}