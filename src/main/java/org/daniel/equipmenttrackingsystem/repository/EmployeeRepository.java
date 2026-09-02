package org.daniel.equipmenttrackingsystem.repository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    boolean existsByEmail(String email);

    Optional<Employee> findByEmail(@NotBlank(message = "Email is required") @Email(message = "Email must be valid") String email);
}
