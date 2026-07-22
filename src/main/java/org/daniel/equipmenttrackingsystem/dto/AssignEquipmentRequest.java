package org.daniel.equipmenttrackingsystem.dto;

import java.util.UUID;

public record AssignEquipmentRequest(
         UUID employeeId,
         UUID equipmentId) {

}
