package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.*;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AssignmentServiceTest {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EquipmentService equipmentService;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @BeforeEach
    void setup(){
        assignmentRepository.deleteAll();
    }

    @Test
    void should_assign_equipment(){
        //Given
        EmployeeRequest employeeRequest = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );

        EmployeeResponse employeeResponse = employeeService.createEmployee(employeeRequest);
        EquipmentResponse equipmentResponse = equipmentService.createEquipment(equipmentRequest);

        //When
        assignmentService.assignEquipment(
                employeeResponse.id(),
                equipmentResponse.id());

        EquipmentResponse assignedEquipment = equipmentService.getEquipmentById(equipmentResponse.id());

        //Then
        assertNotNull(assignedEquipment);
        assertEquals(EquipmentStatus.ASSIGNED, assignedEquipment.status());
    }

    @Test
    void should_not_assign_equipment_to_inactive_employee(){

        //Given
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );

        EmployeeRequest employeeRequest = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "department",
                "position",
                LocalDate.now(),
                false
        );

        EquipmentResponse equipmentResponse = equipmentService.createEquipment(equipmentRequest);
        EmployeeResponse employeeResponse = employeeService.createEmployee(employeeRequest);

        //When
        BusinessRuleException exception = assertThrows(
                BusinessRuleException.class,
                () -> assignmentService.assignEquipment(employeeResponse.id(), equipmentResponse.id())
        );
        //Then
        assertEquals("Cannot assign equipment to inactive employee", exception.getMessage());
    }

    @Test
    void should_not_assign_retired_equipment(){

        //Given
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.RETIRED,
                "SN-01-0000094"
        );

        EmployeeRequest employeeRequest = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );

        EquipmentResponse equipmentResponse = equipmentService.createEquipment(equipmentRequest);
        EmployeeResponse employeeResponse = employeeService.createEmployee(employeeRequest);

        //When
        BusinessRuleException exception = assertThrows(
                BusinessRuleException.class,
                () -> assignmentService.assignEquipment(employeeResponse.id(), equipmentResponse.id())
        );
        //Then
        assertEquals("Cannot assign equipment that is retired", exception.getMessage());
    }

    @Test
    void should_not_assign_assigned_equipment(){

        //Given
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.ASSIGNED,
                "SN-01-0000094"
        );

        EmployeeRequest employeeRequest = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );

        EquipmentResponse equipmentResponse = equipmentService.createEquipment(equipmentRequest);
        EmployeeResponse employeeResponse = employeeService.createEmployee(employeeRequest);

        //When
        BusinessRuleException exception = assertThrows(
                BusinessRuleException.class,
                () -> assignmentService.assignEquipment(employeeResponse.id(), equipmentResponse.id())
        );
        //Then
        assertEquals("Equipment is not available for assignment", exception.getMessage());
    }

    @Test
    void should_return_equipment_successfully() {
        // Given
        EmployeeResponse employee = employeeService.createEmployee(new EmployeeRequest(
                "John", "Doe", "john.doe@example.com", "Engineering", "Developer", LocalDate.now(), true
        ));
        EquipmentResponse equipment = equipmentService.createEquipment(new EquipmentRequest(
                "MacBook Pro", EquipmentType.LAPTOP, "Apple", "M3", EquipmentStatus.AVAILABLE, "SN-RET-001"
        ));

        AssignmentResponse assignment = assignmentService.assignEquipment(employee.id(), equipment.id());

        // When
        AssignmentResponse returnedAssignment = assignmentService.returnEquipment(assignment.id());
        EquipmentResponse updatedEquipment = equipmentService.getEquipmentById(equipment.id());

        // Then
        assertNotNull(returnedAssignment);
        assertNotNull(returnedAssignment.returnedAt());
        assertEquals(EquipmentStatus.AVAILABLE, updatedEquipment.status());
    }

    @Test
    void should_not_return_equipment_already_returned() {
        // Given
        EmployeeResponse employee = employeeService.createEmployee(new EmployeeRequest(
                "Jane", "Doe", "jane.doe@example.com", "Engineering", "Developer", LocalDate.now(), true
        ));
        EquipmentResponse equipment = equipmentService.createEquipment(new EquipmentRequest(
                "Dell XPS", EquipmentType.LAPTOP, "Dell", "XPS 15", EquipmentStatus.AVAILABLE, "SN-RET-002"
        ));

        AssignmentResponse assignment = assignmentService.assignEquipment(employee.id(), equipment.id());

        assignmentService.returnEquipment(assignment.id());

        // When
        BusinessRuleException exception = assertThrows(
                BusinessRuleException.class,
                () -> assignmentService.returnEquipment(assignment.id())
        );

        //Then
        assertEquals("Equipment has already been returned", exception.getMessage());
    }

}
