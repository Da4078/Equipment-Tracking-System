package org.daniel.equipmenttrackingsystem.repository;

import org.daniel.equipmenttrackingsystem.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {

    boolean existsByEmployeeIdAndReturnedAtIsNull(UUID id);

    boolean existsByEquipmentId(UUID id);

    Optional<Assignment> findByEquipmentIdAndReturnedAtIsNull(UUID id);

    List<Assignment> findAllByEquipmentIdOrderByAssignedAtDesc(UUID equipmentId);

    List<Assignment> findAllByEmployeeIdOrderByAssignedAtDesc(UUID employeeId);

}
