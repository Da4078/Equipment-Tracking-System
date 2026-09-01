package org.daniel.equipmenttrackingsystem.dto;

import org.daniel.equipmenttrackingsystem.enums.UserRole;
import org.daniel.equipmenttrackingsystem.model.User;

import java.util.Set;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        Set<UserRole> roles,
        String token
) {

    public static UserResponse fromEntity(User user, String token) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getRoles(),
                token
        );
    }

    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getRoles(),
                null
        );
    }
}