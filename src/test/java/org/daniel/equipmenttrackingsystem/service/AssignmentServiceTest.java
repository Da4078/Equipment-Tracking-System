package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.*;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
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

        Optional<EquipmentResponse> assignedEquipment = equipmentService.getEquipmentById(equipmentResponse.id());

        //Then
        assertTrue(assignedEquipment.isPresent());
        assertEquals(EquipmentStatus.ASSIGNED, assignedEquipment.get().status());
    }

}
