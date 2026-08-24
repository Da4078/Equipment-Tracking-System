package org.daniel.equipmenttrackingsystem.config;

import org.daniel.equipmenttrackingsystem.enums.UserRole;
import org.daniel.equipmenttrackingsystem.model.User;
import org.daniel.equipmenttrackingsystem.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
          if(!userRepository.existsByEmail("admin@example.com")){
              User admin = User.builder()
                      .email("admin@example.com")
                      .password(passwordEncoder.encode("admin123"))
                      .roles(Set.of(UserRole.ROLE_ADMIN))
                      .build();

              userRepository.save(admin);
          }
        };
    }
}
