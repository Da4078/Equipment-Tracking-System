package org.daniel.equipmenttrackingsystem.service;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.model.Assignment;
import org.daniel.equipmenttrackingsystem.model.Equipment;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class EquipmentSpecifications {

    public static Specification<Equipment> hasStatus(EquipmentStatus status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null) {
                return null;
            }
            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    public static Specification<Equipment> isAvailable() {
        return hasStatus(EquipmentStatus.AVAILABLE);
    }

    public static Specification<Equipment> isOutstanding() {
        return (root, query, criteriaBuilder) -> {
            if (Equipment.class.equals(query.getResultType())) {
                query.distinct(true);
            }
            Join<Equipment, Assignment> assignment = root.join("assignments", JoinType.INNER);
            return criteriaBuilder.isNull(assignment.get("returnedAt"));
        };
    }

    public static Specification<Equipment> isHeldByEmployee(UUID employeeId) {
        return (root, query, criteriaBuilder) -> {
            if (employeeId == null) {
                return criteriaBuilder.conjunction();
            }
            if (Equipment.class.equals(query.getResultType())) {
                query.distinct(true);
            }
            Join<Equipment, Assignment> assignment = root.join("assignments", JoinType.INNER);
            return criteriaBuilder.and(
                    criteriaBuilder.equal(assignment.get("employee").get("id"), employeeId),
                    criteriaBuilder.isNull(assignment.get("returnedAt"))
            );
        };
    }
}