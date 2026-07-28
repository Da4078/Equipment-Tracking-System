package org.daniel.equipmenttrackingsystem.controller;

import jakarta.transaction.Transactional;
import org.daniel.equipmenttrackingsystem.dto.*;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AssignmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private EmployeeResponse createEmployeeTest(String firstName,
                                                String lastName,
                                                String email,
                                                String department,
                                                String position,
                                                LocalDate hireDate,
                                                boolean active) throws Exception {
        EmployeeRequest request = new EmployeeRequest(firstName,
                lastName,
                email,
                department,
                position,
                hireDate,
                active);

        MvcResult result = mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readValue(result.getResponse().getContentAsString(), EmployeeResponse.class);
    }

    private EquipmentResponse createEquipmentTest(
            String equipmentName,
            EquipmentType type,
            String brand,
            String model,
            EquipmentStatus status,
            String serialNumber) throws Exception {

        EquipmentRequest request = new EquipmentRequest(
                equipmentName,
                type,
                brand,
                model,
                status,
                serialNumber);

        MvcResult result = mockMvc.perform(post("/api/equipment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readValue(result.getResponse().getContentAsString(), EquipmentResponse.class);
    }

    private AssignmentResponse createTestAssignment(
            UUID employeeId, UUID equipmentId) throws Exception {
        AssignEquipmentRequest request = new AssignEquipmentRequest(employeeId, equipmentId);

        MvcResult result = mockMvc.perform(post("/api/assignments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readValue(result.getResponse().getContentAsString(), AssignmentResponse.class);
    }

    @Test
    @DisplayName("POST /api/assignments - Should assign equipment and return 200 OK")
    void should_assign_equipment_and_return_200_ok() throws Exception{
        EmployeeResponse employeeResponse = createEmployeeTest(
                "John",
                "Doe",
                "john.doe@example.com",
                "Engineering",
                "Software Engineer",
                LocalDate.of(2023, 1, 15),
                true);
        EquipmentResponse equipmentResponse = createEquipmentTest(
                "MacBook Pro 16",
                EquipmentType.LAPTOP,
                "Apple",
                "M3 Max",
                EquipmentStatus.AVAILABLE,
                "SN-123456789");

        AssignEquipmentRequest assignEquipmentRequest = new AssignEquipmentRequest(
                employeeResponse.id(), equipmentResponse.id());

        mockMvc.perform(post("/api/assignments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(assignEquipmentRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists());

    }

    @Test
    @DisplayName("POST /api/assignments - Should return 400 Bad Request when validation fails")
    void should_return_400_bad_request_when_validation_fails() throws Exception{


        AssignEquipmentRequest assignEquipmentRequest = new AssignEquipmentRequest(
                null, null);

        mockMvc.perform(post("/api/assignments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(assignEquipmentRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/assignments/{id}/return - Should return equipment and return 200 OK")
    void should_return_equipment_and_return_200_ok() throws Exception{
        EmployeeResponse employeeResponse = createEmployeeTest(
                "John",
                "Doe",
                "john.doe@example.com",
                "Engineering",
                "Software Engineer",
                LocalDate.of(2023, 1, 15),
                true);
        EquipmentResponse equipmentResponse = createEquipmentTest(
                "MacBook Pro 16",
                EquipmentType.LAPTOP,
                "Apple",
                "M3 Max",
                EquipmentStatus.AVAILABLE,
                "SN-123456789");

        AssignmentResponse assignmentResponse = createTestAssignment(employeeResponse.id(), equipmentResponse.id());

        mockMvc.perform(post("/api/assignments/{id}/return", assignmentResponse.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(assignmentResponse.id().toString()));
    }

    @Test
    @DisplayName("POST /api/assignments/{id}/return - Should return 404 Not Found when assignment does not exist")
    void should_return_404_not_found_when_returning_nonexistent_assignment() throws Exception {
        UUID randomAssignmentId = UUID.randomUUID();

        mockMvc.perform(post("/api/assignments/{id}/return", randomAssignmentId))
                .andExpect(status().isNotFound());
    }
}
