package org.daniel.equipmenttrackingsystem.dto;

import org.daniel.equipmenttrackingsystem.enums.UserRole;
import org.daniel.equipmenttrackingsystem.model.User;

import java.util.Set;
import java.util.UUID;

public record UserResponse(
        UUID id,
        UUID employeeId,
        String email,
        Set<UserRole> roles
) {

    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmployee() != null
                        ? user.getEmployee().getId()
                        : null,
                user.getEmail(),
                user.getRoles()
        );
    }
}