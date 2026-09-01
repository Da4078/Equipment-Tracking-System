package org.daniel.equipmenttrackingsystem.dto;

import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.daniel.equipmenttrackingsystem.model.Equipment;

import java.time.LocalDateTime;
import java.util.UUID;

public record EquipmentResponse(
        UUID id,
        String equipmentName,
        EquipmentType type,
        String brand,
        String model,
        EquipmentStatus status,
        String serialNumber,
        UUID assignmentId,
        UUID assignedEmployeeId,
        String assignedEmployeeName,
        LocalDateTime assignedAt
) {

    public static EquipmentResponse fromEntity(
            Equipment equipment,
            UUID assignmentId,
            UUID assignedEmployeeId,
            String assignedEmployeeName,
            LocalDateTime assignedAt
            ) {
        if (equipment == null) {
            return null;
        }

        return new EquipmentResponse(
                equipment.getId(),
                equipment.getEquipmentName(),
                equipment.getType(),
                equipment.getBrand(),
                equipment.getModel(),
                equipment.getStatus(),
                equipment.getSerialNumber(),
                assignmentId,
                assignedEmployeeId,
                assignedEmployeeName,
                assignedAt
        );
    }
}
