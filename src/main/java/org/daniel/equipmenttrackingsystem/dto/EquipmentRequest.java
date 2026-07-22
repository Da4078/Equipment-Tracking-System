package org.daniel.equipmenttrackingsystem.dto;

import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.daniel.equipmenttrackingsystem.model.Equipment;

public record EquipmentRequest(
        String equipmentName,
        EquipmentType type,
        String brand,
        String model,
        EquipmentStatus status,
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