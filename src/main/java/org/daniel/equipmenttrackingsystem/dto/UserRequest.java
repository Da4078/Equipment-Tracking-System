package org.daniel.equipmenttrackingsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.daniel.equipmenttrackingsystem.model.User;

public record UserRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        String password

) {

    public User toEntity() {
        User user = new User();
        user.setEmail(email);
        return user;
    }
}