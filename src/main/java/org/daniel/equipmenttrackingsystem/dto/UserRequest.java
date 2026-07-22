package org.daniel.equipmenttrackingsystem.dto;

import org.daniel.equipmenttrackingsystem.model.User;

public record UserRequest(
        String firstName,
        String lastName,
        String email
) {
    public User toEntity() {
        User user = new User();
        user.setFirstName(this.firstName());
        user.setLastName(this.lastName());
        user.setEmail(this.email());
        return user;
    }
}