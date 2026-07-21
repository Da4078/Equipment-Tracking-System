package org.daniel.equipmenttrackingsystem.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class AssignEquipmentRequestDTO {
    private UUID employeeId;
    private UUID equipmentId;
}
