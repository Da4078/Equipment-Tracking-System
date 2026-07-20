package org.daniel.equipmenttrackingsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "equipment")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Equipment name is required")
    private String equipmentName;

    @Enumerated(EnumType.STRING)
    private EquipmentType type;

    private String brand;

    private String model;

    @Enumerated(EnumType.STRING)
    private EquipmentStatus status = EquipmentStatus.AVAILABLE;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @OneToMany(mappedBy = "equipment")
    private List<Assignment> assignments = new ArrayList<>();

}
