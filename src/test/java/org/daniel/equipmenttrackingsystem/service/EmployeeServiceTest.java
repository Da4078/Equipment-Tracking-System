package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.EmployeeRequest;
import org.daniel.equipmenttrackingsystem.dto.EmployeeResponse;
import org.daniel.equipmenttrackingsystem.dto.EquipmentRequest;
import org.daniel.equipmenttrackingsystem.dto.EquipmentResponse;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.daniel.equipmenttrackingsystem.exception.BusinessRuleException;
import org.daniel.equipmenttrackingsystem.exception.ResourceNotFoundException;
import org.daniel.equipmenttrackingsystem.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class EmployeeServiceTest {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EquipmentService equipmentService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AssignmentService assignmentService;

    @BeforeEach
    void setUp() {
        employeeRepository.deleteAll();
    }

    @Test
    void should_create_employee() {
        // Given
        EmployeeRequest employeeRequest = new EmployeeRequest(
                "Name1",
                "Surname1",
                "test@test.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );

        // When
        EmployeeResponse created = employeeService.createEmployee(employeeRequest);

        // Then
        assertNotNull(created);
        assertNotNull(created.id());
        assertEquals("Name1", created.firstName());
        assertEquals("test@test.com", created.email());
        assertTrue(created.active());
    }

    @Test
    void should_not_create_employee_with_same_email() {
        // Given
        EmployeeRequest employeeRequest1 = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );
        employeeService.createEmployee(employeeRequest1);

        // When
        EmployeeRequest employeeRequest2 = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "other department",
                "other position",
                LocalDate.now(),
                true
        );

        BusinessRuleException exception = assertThrows(
                BusinessRuleException.class,
                () -> employeeService.createEmployee(employeeRequest2)
        );

        // Then
        assertEquals("Employee with email 'john@doe.com' already exists", exception.getMessage());
    }

    @Test
    void should_get_employee_by_id() {
        // Given
        EmployeeRequest employeeRequest = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );
        EmployeeResponse saved = employeeService.createEmployee(employeeRequest);

        // When
        EmployeeResponse found = employeeService.getEmployeeById(saved.id());

        // Then
        assertNotNull(found);
        assertEquals(saved.id(), found.id());
        assertEquals("John", found.firstName());
    }

    @Test
    void should_get_all_employees() {
        // Given
        EmployeeRequest employee1 = new EmployeeRequest(
                "Name1",
                "Surname1",
                "test1@test.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );
        EmployeeRequest employee2 = new EmployeeRequest(
                "Name2",
                "Surname2",
                "test2@test.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );

        employeeService.createEmployee(employee1);
        employeeService.createEmployee(employee2);

        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<EmployeeResponse> response = employeeService.getAllEmployees(pageable);

        // Then
        assertNotNull(response);
        assertEquals(2, response.getTotalElements());
        assertEquals(1, response.getTotalPages());
        assertEquals(2, response.getContent().size());

        assertEquals("Name1", response.getContent().get(0).firstName());
        assertEquals("Name2", response.getContent().get(1).firstName());
    }

    @Test
    void should_update_employee() {
        // Given
        EmployeeRequest employee1 = new EmployeeRequest(
                "Name1",
                "Surname1",
                "test1@test.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );
        EmployeeRequest employee2 = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );

        EmployeeResponse savedEmployee = employeeService.createEmployee(employee1);

        // When
        EmployeeResponse response = employeeService.updateEmployee(savedEmployee.id(), employee2);

        // Then
        assertNotNull(response);
        assertNotNull(response.id());
        assertEquals("John", response.firstName());
        assertEquals("Doe", response.lastName());
        assertEquals("john@doe.com", response.email());
        assertEquals("department", response.department());
        assertEquals("position", response.position());
        assertTrue(response.active());
    }

    @Test
    void should_delete_employee() {
        // Given
        EmployeeRequest employee1 = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );

        EmployeeResponse savedEmployee = employeeService.createEmployee(employee1);

        // When
        employeeService.deleteEmployee(savedEmployee.id());

        // Then (Fetching deleted employee must throw ResourceNotFoundException)
        assertThrows(
                ResourceNotFoundException.class,
                () -> employeeService.getEmployeeById(savedEmployee.id())
        );
    }

    @Test
    void should_not_delete_employee_with_assignment() {
        // Given
        EmployeeRequest employee = new EmployeeRequest(
                "John",
                "Doe",
                "john@doe.com",
                "department",
                "position",
                LocalDate.now(),
                true
        );
        EmployeeResponse savedEmployee = employeeService.createEmployee(employee);

        EquipmentRequest equipment = new EquipmentRequest(
                "Laptop Lenovo 4k",
                EquipmentType.LAPTOP,
                "LENOVO",
                "LOQ",
                EquipmentStatus.AVAILABLE,
                "f34as24d"
        );

        EquipmentResponse savedEquipment = equipmentService.createEquipment(equipment);

        assignmentService.assignEquipment(savedEmployee.id(), savedEquipment.id());

        // When
        BusinessRuleException exception = assertThrows(
                BusinessRuleException.class,
                () -> employeeService.deleteEmployee(savedEmployee.id())
        );

        assertEquals("Cannot delete employee with active equipment assignments", exception.getMessage());

        // Then (Employee must still exist)
        EmployeeResponse employeeInDb = employeeService.getEmployeeById(savedEmployee.id());
        assertNotNull(employeeInDb);
        assertEquals(savedEmployee.id(), employeeInDb.id());
    }
}