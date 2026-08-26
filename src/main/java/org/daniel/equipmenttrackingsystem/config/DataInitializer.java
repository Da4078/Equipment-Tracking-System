package org.daniel.equipmenttrackingsystem.config;

import org.daniel.equipmenttrackingsystem.model.User;
import org.daniel.equipmenttrackingsystem.enums .UserRole;
import org.daniel.equipmenttrackingsystem.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepository.findByEmail("admin@example.com")
                    .orElseGet(() -> User.builder().email("admin@example.com").build());

            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(UserRole.ROLE_ADMIN));
            userRepository.save(admin);
        };
    }
}