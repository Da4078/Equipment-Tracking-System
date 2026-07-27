package org.daniel.equipmenttrackingsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.daniel.equipmenttrackingsystem.model.Equipment;

public record EquipmentRequest(

        @NotBlank(message = "Equipment name is required")
        @Size(max = 100, message = "Equipment name cannot exceed 100 characters")
        String equipmentName,

        @NotNull
        EquipmentType type,

        @NotBlank(message = "Brand name is required")
        String brand,

        @NotBlank(message = "Model name is required")
        String model,

        @NotNull
        EquipmentStatus status,

        @NotBlank
        String serialNumber
) {
    public Equipment toEntity() {
        Equipment equipment = new Equipment();
        equipment.setEquipmentName(this.equipmentName());
        equipment.setType(this.type());
        equipment.setBrand(this.brand());
        equipment.setModel(this.model());
        equipment.setStatus(this.status() != null ? this.status() : EquipmentStatus.AVAILABLE);
        equipment.setSerialNumber(this.serialNumber());
        return equipment;
    }
}