package org.daniel.equipmenttrackingsystem.repository;

import org.daniel.equipmenttrackingsystem.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    boolean existsByEmployeeIdAndReturnedAtIsNull(UUID id);

    boolean existsByEquipmentId(UUID id);
}
