package org.daniel.equipmenttrackingsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.daniel.equipmenttrackingsystem.model.User;

public record UserRequest(
        @NotBlank
        @Size(max = 50, message = "First name cannot exceed 50 characters")
        String firstName,

        @NotBlank
        @Size(max = 50, message = "Last name cannot exceed 50 characters")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email
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