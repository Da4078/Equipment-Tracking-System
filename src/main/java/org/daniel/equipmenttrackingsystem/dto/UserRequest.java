package org.daniel.equipmenttrackingsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.daniel.equipmenttrackingsystem.enums.UserRole;
import org.daniel.equipmenttrackingsystem.model.User;

import java.util.Set;

public record UserRequest(

        @NotBlank(message = "Email is required")
        @Email
        String email,

        @NotBlank
        @Size(min = 6)
        String password
) {
    public User toEntity() {
        User user = new User();
        user.setEmail(this.email());
        user.setPassword(this.password());
        user.setRoles(Set.of(UserRole.ROLE_EMPLOYEE));
        return user;
    }
}