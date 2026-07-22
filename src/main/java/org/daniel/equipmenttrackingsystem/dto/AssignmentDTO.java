package org.daniel.equipmenttrackingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentDTO {
    private UUID id;

    private UUID employeeId;
    private String employeeName;

    private UUID equipmentId;
    private String equipmentName;

    private LocalDateTime assignedAt;
    private LocalDateTime returnedAt;
}
