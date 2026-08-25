package org.daniel.equipmenttrackingsystem.dto;

import org.daniel.equipmenttrackingsystem.model.User;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String token
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(user.getId(), user.getEmail(), null);
    }

    public static UserResponse fromEntity(User user, String token) {
        return new UserResponse(user.getId(), user.getEmail(), token);
    }
}