package org.daniel.equipmenttrackingsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.daniel.equipmenttrackingsystem.enums.SignupRole;
import org.daniel.equipmenttrackingsystem.enums.UserRole;
import org.daniel.equipmenttrackingsystem.model.User;

import java.util.HashSet;
import java.util.Set;

public record UserRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        String password,

        @NotNull(message = "Role is required")
        SignupRole role

) {

    public User toEntity() {

        User user = new User();

        user.setEmail(email);
        user.setPassword(password);

        user.setRoles(new HashSet<>(
                switch (role) {
                    case MANAGER -> Set.of(UserRole.ROLE_ADMIN);
                }
        ));

        return user;
    }
}