package org.daniel.equipmenttrackingsystem.enums;

import org.daniel.equipmenttrackingsystem.model.Equipment;
import org.daniel.equipmenttrackingsystem.repository.EquipmentSpecifications;
import org.springframework.data.jpa.domain.Specification;

public enum EquipmentFilter {
    AVAILABLE{
        @Override
        public Specification<Equipment> toSpecification(){
            return EquipmentSpecifications.isAvailable();
        }
    },

    OUTSTANDING{
        @Override
        public Specification<Equipment> toSpecification(){
            return EquipmentSpecifications.isOutstanding();
        }
    };

    public abstract Specification<Equipment> toSpecification();
}
