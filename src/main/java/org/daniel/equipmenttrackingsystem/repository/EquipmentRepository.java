package org.daniel.equipmenttrackingsystem.repository;

import org.daniel.equipmenttrackingsystem.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, UUID> {
    boolean existsBySerialNumber(String serialNumber);
}
