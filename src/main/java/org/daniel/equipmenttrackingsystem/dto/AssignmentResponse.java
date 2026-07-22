package org.daniel.equipmenttrackingsystem.dto;


import java.time.LocalDateTime;
import java.util.UUID;

public record AssignmentResponse (
         UUID id,
         UUID employeeId,
         String employeeName,
         UUID equipmentId,
         String equipmentName,
         LocalDateTime assignedAt,
         LocalDateTime returnedAt
){

}
