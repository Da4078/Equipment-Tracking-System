package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.EquipmentRequest;
import org.daniel.equipmenttrackingsystem.dto.EquipmentResponse;
import org.daniel.equipmenttrackingsystem.enums.EquipmentFilter;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.exception.ResourceNotFoundException;
import org.daniel.equipmenttrackingsystem.model.Assignment;
import org.daniel.equipmenttrackingsystem.model.Equipment;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.daniel.equipmenttrackingsystem.repository.EquipmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final AssignmentRepository assignmentRepository;

    public EquipmentService(EquipmentRepository equipmentRepository,
                            AssignmentRepository assignmentRepository) {
        this.equipmentRepository = equipmentRepository;
        this.assignmentRepository = assignmentRepository;
    }

    private EquipmentResponse mapToResponse(Equipment equipment) {
        UUID assignmentId = null;
        UUID empId = null;
        String empName = null;
        LocalDateTime assignedAt = null;

        if (EquipmentStatus.ASSIGNED.equals(equipment.getStatus())) {
            Optional<Assignment> assignmentOpt =
                    assignmentRepository.findByEquipmentIdAndReturnedAtIsNull(equipment.getId());

            if (assignmentOpt.isPresent()) {
                Assignment assignment = assignmentOpt.get();

                assignmentId = assignment.getId();
                assignedAt = assignment.getAssignedAt();

                if (assignment.getEmployee() != null) {
                    empId = assignment.getEmployee().getId();
                    empName = assignment.getEmployee().getFirstName()
                            + " "
                            + assignment.getEmployee().getLastName();
                }
            }
        }

        return EquipmentResponse.fromEntity(
                equipment,
                assignmentId,
                empId,
                empName,
                assignedAt
        );
    }

    @Transactional
    public EquipmentResponse createEquipment(EquipmentRequest equipmentRequest) {
        if (equipmentRepository.existsBySerialNumber(equipmentRequest.serialNumber())) {
            throw new BusinessRuleException(
                    "Equipment with serial number '"
                            + equipmentRequest.serialNumber()
                            + "' already exists"
            );
        }

        Equipment equipment = equipmentRequest.toEntity();
        Equipment savedEquipment = equipmentRepository.save(equipment);

        return mapToResponse(savedEquipment);
    }

    @Transactional(readOnly = true)
    public EquipmentResponse getEquipmentById(UUID id) {
        return equipmentRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Equipment not found with ID: " + id
                        )
                );
    }

    @Transactional(readOnly = true)
    public Page<EquipmentResponse> getAllEquipment(
            EquipmentFilter equipmentFilter,
            Pageable pageable
    ) {
        Specification<Equipment> spec = (equipmentFilter != null)
                ? equipmentFilter.toSpecification()
                : Specification.allOf();

        return equipmentRepository.findAll(spec, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public EquipmentResponse updateEquipment(
            UUID id,
            EquipmentRequest equipmentRequest
    ) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Equipment not found with ID: " + id
                        )
                );

        equipment.setEquipmentName(equipmentRequest.equipmentName());
        equipment.setType(equipmentRequest.type());
        equipment.setBrand(equipmentRequest.brand());
        equipment.setModel(equipmentRequest.model());

        Equipment updatedEquipment = equipmentRepository.save(equipment);

        return mapToResponse(updatedEquipment);
    }

    @Transactional
    public void deleteEquipment(UUID id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Equipment not found with ID: " + id
                        )
                );

        if (equipment.getStatus() == EquipmentStatus.RETIRED) {
            throw new BusinessRuleException(
                    "Equipment is already retired"
            );
        }

        boolean currentlyAssigned = assignmentRepository.findByEquipmentIdAndReturnedAtIsNull(id).isPresent();

        if(currentlyAssigned){
            throw new BusinessRuleException("Cannot delete equipment while it is assigned. Return the equipment first.");
        }

        boolean hasHistory = assignmentRepository.existsByEquipmentId(id);

        if (hasHistory) {
            equipment.setStatus(EquipmentStatus.RETIRED);
            equipmentRepository.save(equipment);
        } else {
            equipmentRepository.delete(equipment);
        }
    }

    @Transactional(readOnly = true)
    public List<EquipmentResponse> getAvailableEquipment() {
        Specification<Equipment> spec =
                EquipmentSpecifications.isAvailable();

        return equipmentRepository.findAll(spec)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EquipmentResponse> getOutstandingEquipment() {
        Specification<Equipment> spec =
                EquipmentSpecifications.isOutstanding();

        return equipmentRepository.findAll(spec)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EquipmentResponse> getEquipmentHeldByEmployee(
            UUID employeeId
    ) {
        Specification<Equipment> spec =
                EquipmentSpecifications.isHeldByEmployee(employeeId);

        return equipmentRepository.findAll(spec)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}
