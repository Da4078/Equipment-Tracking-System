package org.daniel.equipmenttrackingsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.daniel.equipmenttrackingsystem.enums.SignupRole;
import org.daniel.equipmenttrackingsystem.model.User;

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

        user.setRoles(
                switch (role) {
                    case MANAGER -> java.util.Set.of(
                            org.daniel.equipmenttrackingsystem.enums.UserRole.ROLE_ADMIN
                    );

                    case EMPLOYEE -> java.util.Set.of(
                            org.daniel.equipmenttrackingsystem.enums.UserRole.ROLE_EMPLOYEE
                    );
                }
        );

        return user;
    }
}