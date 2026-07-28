package org.daniel.equipmenttrackingsystem.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignEquipmentRequest(

        @NotNull
        UUID employeeId,

        @NotNull
        UUID equipmentId) {

}
