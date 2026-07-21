package org.daniel.equipmenttrackingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.daniel.equipmenttrackingsystem.model.Equipment;
import org.daniel.equipmenttrackingsystem.model.User;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EquipmentDTO {

    private UUID id;
    private String equipmentName;
    private EquipmentType type;
    private String brand;
    private String model;
    private EquipmentStatus status;
    private String serialNumber;

    public static EquipmentDTO fromEntity(Equipment equipment){
        if(equipment == null){
            return null;
        }
        return new EquipmentDTO(
                equipment.getId(),
                equipment.getEquipmentName(),
                equipment.getType(),
                equipment.getBrand(),
                equipment.getModel(),
                equipment.getStatus(),
                equipment.getSerialNumber()
        );

    }
    public Equipment toEntity(){
        Equipment equipment = new Equipment();
        equipment.setEquipmentName(this.equipmentName);
        equipment.setType(this.type);
        equipment.setBrand(this.brand);
        equipment.setModel(this.model);
        equipment.setStatus(this.status);
        equipment.setSerialNumber(this.serialNumber);
        return equipment;
    }
}
