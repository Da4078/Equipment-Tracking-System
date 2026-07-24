package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.*;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.daniel.equipmenttrackingsystem.repository.AssignmentRepository;
import org.daniel.equipmenttrackingsystem.repository.EquipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class EquipmentServiceTest {

    @Autowired
    private EquipmentService equipmentService;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private AssignmentService assignmentService;

    @BeforeEach
    void setUp(){
        equipmentRepository.deleteAll();
    }

    @Test
    void should_create_equipment(){
        //Given
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );

        //Then
        EquipmentResponse created = equipmentService.createEquipment(equipmentRequest);

        //When
        assertNotNull(created);
        assertNotNull(created.id());
        assertEquals("SN-01-0000094", created.serialNumber());
    }

    @Test
    void should_not_create_equipment_with_the_same_serial_number(){
        //Given
        EquipmentRequest equipment1 = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );
        equipmentService.createEquipment(equipment1);

        //When
        EquipmentRequest equipment2 = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );

        //Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> equipmentService.createEquipment(equipment2)
        );

        assertEquals("Equipment with this serial number already exists", exception.getMessage());
    }

    @Test
    void should_get_equipment_by_id(){
        //Given
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "Iphone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-01-0000094"
        );

        EquipmentResponse created = equipmentService.createEquipment(equipmentRequest);

        //When
        Optional<EquipmentResponse> found = equipmentService.getEquipmentById(created.id());

        //Then
        assertTrue(found.isPresent());
        assertEquals(created.id(), found.get().id());
        assertEquals("SN-01-0000094", found.get().serialNumber());
    }

    @Test
    void should_throw_exception_when_updating_non_existent_id(){
        //Given
        UUID nonExistentId = UUID.randomUUID();
        EquipmentRequest updateRequest = new EquipmentRequest(
                "iPhone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-100"
        );

        //When
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> equipmentService.updateEquipment(nonExistentId, updateRequest)
        );

        //Then
        assertEquals("Equipment not found", exception.getMessage());
    }

    @Test
    void should_get_all_equipment(){
        //Given
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

        //When
        equipmentService.createEquipment(equipment1);
        equipmentService.createEquipment(equipment2);

        List<EquipmentResponse> response = equipmentService.getAllEquipment();

        //Then
        assertNotNull(response);
        assertEquals(2, response.size());
    }

    @Test
    void should_update_equipment(){
        //Given
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

        //When
        EquipmentResponse updated = equipmentService.updateEquipment(saved.id(), equipment2);

        //Then
        assertNotNull(updated);
        assertNotNull(updated.id());
        assertEquals("Iphone 14 PRO MAX", updated.equipmentName());
    }

    @Test
    void should_delete_equipment_by_id(){
        //Given
        EquipmentRequest equipmentRequest = new EquipmentRequest(
                "iPhone 17 PRO MAX",
                EquipmentType.PHONE,
                "Apple",
                "PRO MAX",
                EquipmentStatus.AVAILABLE,
                "SN-100"
        );

        EquipmentResponse response = equipmentService.createEquipment(equipmentRequest);

        //When
        equipmentService.deleteEquipment(response.id());

        //Then
        Optional<EquipmentResponse> equipment = equipmentService.getEquipmentById(response.id());
        assertTrue(equipment.isEmpty());
    }

    @Test
    void should_retire_equipment_by_id(){
        //Given
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

        //When
        equipmentService.deleteEquipment(equipmentResponse.id());
        Optional<EquipmentResponse> softDeleted = equipmentService.getEquipmentById(equipmentResponse.id());

        //Then
        assertTrue(softDeleted.isPresent());
        assertEquals(EquipmentStatus.RETIRED, softDeleted.get().status());
    }
}
