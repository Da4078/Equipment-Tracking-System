package org.daniel.equipmenttrackingsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;

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

    @Column(nullable = false)
    private String equipmentName;

    private String type;

    @Enumerated(EnumType.STRING)
    private EquipmentStatus status = EquipmentStatus.AVAILABLE;

    @Column(nullable = false, unique = true)
    private String serialNumber;

}
