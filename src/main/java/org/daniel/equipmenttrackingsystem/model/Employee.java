package org.daniel.equipmenttrackingsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="employees")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    @NotBlank(message = "First name is required")
    private String firstName;

    @Column(nullable = false)
    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email is required")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Department is required")
    private String department;

    @Column(nullable = false)
    @NotBlank(message = "Position is required")
    private String position;

    private LocalDate hireDate;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "employee")
    private List<Assignment> assignments = new ArrayList<>();
}
