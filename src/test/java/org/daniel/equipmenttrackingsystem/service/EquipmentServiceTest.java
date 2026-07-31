package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.*;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.exception.ResourceNotFoundException;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.daniel.equipmenttrackingsystem.repository.EmployeeRepository;
import org.daniel.equipmenttrackingsystem.repository.EquipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class EquipmentServiceTest {

    @Autowired
    private EquipmentService equipmentService;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private AssignmentService assignmentService;

    @BeforeEach
    void setUp() {
        equipmentRepository.deleteAll();
        assignmentRepository.deleteAll();
        employeeRepository.deleteAll();
    }

    @Test
    void should_create_equipment() {
        // Given
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );

        // When
        EquipmentResponse created = equipmentService.createEquipment(equipmentRequest);

        // Then
        assertNotNull(created);
        assertNotNull(created.id());
        assertEquals("SN-01-0000094", created.serialNumber());
    }

    @Test
    void should_not_create_equipment_with_the_same_serial_number() {
        // Given
        EquipmentRequest equipment1 = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );
        equipmentService.createEquipment(equipment1);

        // When
        EquipmentRequest equipment2 = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );

        // Then
        BusinessRuleException exception = assertThrows(
                BusinessRuleException.class,
                () -> equipmentService.createEquipment(equipment2)
        );

        assertEquals("Equipment with serial number '" + equipment2.serialNumber() + "' already exists", exception.getMessage());    }

    @Test
    void should_get_equipment_by_id() {
        // Given
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );

        EquipmentResponse created = equipmentService.createEquipment(equipmentRequest);

        // When
        EquipmentResponse found = equipmentService.getEquipmentById(created.id());

        // Then
        assertNotNull(found);
        assertEquals(created.id(), found.id());
        assertEquals("SN-01-0000094", found.serialNumber());
    }

    @Test
    void should_throw_exception_when_updating_non_existent_id() {
        // Given
        UUID nonExistentId = UUID.randomUUID();
        EquipmentRequest updateRequest = new EquipmentRequest(
                "iPhone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-100"
        );

        // Then
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> equipmentService.updateEquipment(nonExistentId, updateRequest)
        );

        assertEquals("Equipment not found with ID: " + nonExistentId, exception.getMessage());
    }

    @Test
    void should_get_all_equipment() {
        // Given
        EquipmentRequest equipment1 = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );
        EquipmentRequest equipment2 = new EquipmentRequest(
                "Iphone 14 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000097"
        );

        equipmentService.createEquipment(equipment1);
        equipmentService.createEquipment(equipment2);

        // When
        Page<EquipmentResponse> response = equipmentService.getAllEquipment(
                null,
                PageRequest.of(0, 10));

        // Then
        assertNotNull(response);
        assertEquals(2, response.getTotalElements());
        assertEquals(2, response.getContent().size());
    }

    @Test
    void should_update_equipment() {
        // Given
        EquipmentRequest equipment = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );
        EquipmentResponse saved = equipmentService.createEquipment(equipment);

        EquipmentRequest equipment2 = new EquipmentRequest(
                "Iphone 14 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000099"
        );

        // When
        EquipmentResponse updated = equipmentService.updateEquipment(saved.id(), equipment2);

        // Then
        assertNotNull(updated);
        assertNotNull(updated.id());
        assertEquals("Iphone 14 PRO MAX", updated.equipmentName());
    }

    @Test
    void should_delete_equipment_by_id() {
        // Given
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "iPhone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-100"
        );

        EquipmentResponse response = equipmentService.createEquipment(equipmentRequest);

        // When
        equipmentService.deleteEquipment(response.id());

        assertThrows(
                ResourceNotFoundException.class,
                () -> equipmentService.getEquipmentById(response.id())
        );
    }

    @Test
    void should_retire_equipment_by_id() {
        // Given
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "iPhone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-100"
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
        assignmentService.assignEquipment(employeeResponse.id(), equipmentResponse.id());

        // When
        equipmentService.deleteEquipment(equipmentResponse.id());
        EquipmentResponse softDeleted = equipmentService.getEquipmentById(equipmentResponse.id());

        // Then
        assertNotNull(softDeleted);
        assertEquals(EquipmentStatus.RETIRED, softDeleted.status());
    }

    @Test
    void should_get_all_available_equipment(){
        //Given
        EquipmentRequest availableEquipment = new EquipmentRequest(
                "iPhone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-100"
        );
        EquipmentRequest retiredEquipment = new EquipmentRequest(
                "MacBook Pro 16",
                EquipmentType.LAPTOP,
                "Apple",
                "M3",
                EquipmentStatus.RETIRED,
                "SN-200"
        );

        equipmentService.createEquipment(availableEquipment);
        equipmentService.createEquipment(retiredEquipment);

        //When
        List<EquipmentResponse> availableList = equipmentService.getAvailableEquipment();

        //Then
        assertNotNull(availableList);
        assertEquals(1, availableList.size());
        assertEquals("SN-100", availableList.get(0).serialNumber());
        assertEquals(EquipmentStatus.AVAILABLE, availableList.get(0).status());
    }

    @Test
    void should_get_all_outstanding_equipment() {
        // Given
        EquipmentRequest eqRequest1 = new EquipmentRequest(
                "iPhone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-100"
        );
        EquipmentRequest eqRequest2 = new EquipmentRequest(
                "Dell XPS 15",
                EquipmentType.LAPTOP,
                "Dell",
                "XPS",
                EquipmentStatus.AVAILABLE,
                "SN-200"
        );

        EquipmentResponse eq1 = equipmentService.createEquipment(eqRequest1);
        equipmentService.createEquipment(eqRequest2);

        EmployeeRequest employeeRequest = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "Engineering",
                "Developer",
                LocalDate.now(),
                true
        );
        EmployeeResponse employee = employeeService.createEmployee(employeeRequest);

        assignmentService.assignEquipment(employee.id(), eq1.id());

        // When
        List<EquipmentResponse> outstandingList = equipmentService.getOutstandingEquipment();

        // Then
        assertNotNull(outstandingList);
        assertEquals(1, outstandingList.size());
        assertEquals(eq1.id(), outstandingList.get(0).id());
        assertEquals("SN-100", outstandingList.get(0).serialNumber());
    }

    @Test
    void should_get_equipment_held_by_given_employee() {
        // Given
        EquipmentRequest eqRequest1 = new EquipmentRequest(
                "iPhone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-100"
        );
        EquipmentRequest eqRequest2 = new EquipmentRequest(
                "Dell XPS 15",
                EquipmentType.LAPTOP,
                "Dell",
                "XPS",
                EquipmentStatus.AVAILABLE,
                "SN-200"
        );

        EquipmentResponse eq1 = equipmentService.createEquipment(eqRequest1);
        EquipmentResponse eq2 = equipmentService.createEquipment(eqRequest2);

        EmployeeResponse emp1 = employeeService.createEmployee(new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "Dev",
                "Lead",
                LocalDate.now(),
                true
        ));
        EmployeeResponse emp2 = employeeService.createEmployee(new EmployeeRequest(
                "Jane",
                "Smith",
                "jane@smith.com",
                "QA",
                "Tester",
                LocalDate.now(),
                true
        ));

        assignmentService.assignEquipment(emp1.id(), eq1.id());
        assignmentService.assignEquipment(emp2.id(), eq2.id());

        // When
        List<EquipmentResponse> emp1Equipment = equipmentService.getEquipmentHeldByEmployee(emp1.id());

        // Then
        assertNotNull(emp1Equipment);
        assertEquals(1, emp1Equipment.size());
        assertEquals(eq1.id(), emp1Equipment.get(0).id());
        assertEquals("SN-100", emp1Equipment.get(0).serialNumber());
    }
}