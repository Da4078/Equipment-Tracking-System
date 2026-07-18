package org.daniel.equipmenttrackingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EquipmentDTO {

    private UUID id;
    private String equipmentName;
    private String type;
    private EquipmentStatus status;
    private String serialNumber;
}
