package org.daniel.equipmenttrackingsystem.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.daniel.equipmenttrackingsystem.model.Equipment;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentDTO {
    private UUID id;
    private Employee employee;
    private Equipment equipment;
    private LocalDateTime assignedAt;
    private LocalDateTime returnedAt;
}
