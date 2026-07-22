package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.EmployeeRequest;
import org.daniel.equipmenttrackingsystem.dto.EmployeeResponse;
import org.daniel.equipmenttrackingsystem.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EmployeeServiceTest {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @BeforeEach
    void setUp() {
        // Clear database before each test to prevent email unique constraint failures
        employeeRepository.deleteAll();
    }

    @Test
    void should_create_employee() {
        // Given
        EmployeeRequest employeeRequest = new EmployeeRequest(
                "Zvico",
                "Dvica Trica",
                "test@test.com",
                "Odjel",
                "Na skladistu",
                LocalDate.now(),
                true
        );

        // When
        EmployeeResponse created = employeeService.createEmployee(employeeRequest);

        // Then
        assertNotNull(created);
        assertNotNull(created.id()); // Database generates the UUID
        assertEquals("Zvico", created.firstName());
        assertEquals("test@test.com", created.email());
        assertTrue(created.active());
    }

    @Test
    void should_get_employee_by_id() {
        // Given
        EmployeeRequest employeeRequest = new EmployeeRequest(
                "Zvico",
                "Dvica Trica",
                "getbyid@test.com",
                "Odjel",
                "Na skladistu",
                LocalDate.now(),
                true
        );
        EmployeeResponse saved = employeeService.createEmployee(employeeRequest);

        // When
        Optional<EmployeeResponse> found = employeeService.getEmployeeById(saved.id());

        // Then
        assertTrue(found.isPresent());
        assertEquals(saved.id(), found.get().id());
        assertEquals("Zvico", found.get().firstName());
    }
}