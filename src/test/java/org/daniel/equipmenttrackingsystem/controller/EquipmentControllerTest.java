package org.daniel.equipmenttrackingsystem.controller;

import org.daniel.equipmenttrackingsystem.dto.EquipmentRequest;
import org.daniel.equipmenttrackingsystem.dto.EquipmentResponse;
import org.daniel.equipmenttrackingsystem.enums.EquipmentStatus;
import org.daniel.equipmenttrackingsystem.enums.EquipmentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class EquipmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private EquipmentResponse createTestEquipment(
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

    @Test
    @DisplayName("POST /api/equipment - Should create equipment and return 201 Created")
    void should_return_201_created_when_equipment_is_created() throws Exception {
        EquipmentRequest request = new EquipmentRequest(
                "MacBook Pro 16",
                EquipmentType.LAPTOP,
                "Apple",
                "M3 Max",
                EquipmentStatus.AVAILABLE,
                "SN-123456789");

        mockMvc.perform(post("/api/equipment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.equipmentName").value("MacBook Pro 16"))
                .andExpect(jsonPath("$.type").value("LAPTOP"))
                .andExpect(jsonPath("$.brand").value("Apple"))
                .andExpect(jsonPath("$.model").value("M3 Max"))
                .andExpect(jsonPath("$.status").value("AVAILABLE"))
                .andExpect(jsonPath("$.serialNumber").value("SN-123456789"));
    }

    @Test
    @DisplayName("POST /api/equipment - Should return 400 Bad Request when validation fails")
    void should_return_400_bad_request_when_validation_fails() throws Exception {
        EquipmentRequest invalidRequest = new EquipmentRequest(
                "",
                null,
                "",
                "",
                null,
                "");

        mockMvc.perform(post("/api/equipment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/equipment/{id} - Should return 200 OK when equipment exists")
    void should_return_200_ok_when_equipment_exists() throws Exception {
        EquipmentResponse createdEquipment = createTestEquipment(
                "MacBook Pro 16",
                EquipmentType.LAPTOP,
                "Apple",
                "M3 Max",
                EquipmentStatus.AVAILABLE,
                "SN-123456789");

        mockMvc.perform(get("/api/equipment/{id}", createdEquipment.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdEquipment.id().toString()))
                .andExpect(jsonPath("$.equipmentName").value("MacBook Pro 16"))
                .andExpect(jsonPath("$.type").value("LAPTOP"))
                .andExpect(jsonPath("$.brand").value("Apple"))
                .andExpect(jsonPath("$.model").value("M3 Max"))
                .andExpect(jsonPath("$.status").value("AVAILABLE"))
                .andExpect(jsonPath("$.serialNumber").value("SN-123456789"));
    }

    @Test
    @DisplayName("GET /api/equipment/{id} - Should return 404 Not Found when equipment does not exist")
    void should_return_404_not_found_when_equipment_doesnt_exist() throws Exception {
        UUID randomId = UUID.randomUUID();

        mockMvc.perform(get("/api/equipment/{id}", randomId))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/equipment - Should return paginated list containing created equipment")
    void should_return_list_of_equipment() throws Exception {
        createTestEquipment(
                "MacBook Pro 16", EquipmentType.LAPTOP, "Apple", "M3 Max", EquipmentStatus.AVAILABLE, "SN-001");
        createTestEquipment(
                "Dell UltraSharp 27", EquipmentType.MONITOR, "Dell", "U2723QE", EquipmentStatus.AVAILABLE, "SN-002");

        mockMvc.perform(get("/api/equipment")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.content[*].serialNumber", hasItems("SN-001", "SN-002")));
    }

    @Test
    @DisplayName("PUT /api/equipment/{id} - Should update existing equipment and return 200 OK")
    void should_update_equipment_and_return_200_ok() throws Exception {
        EquipmentResponse createdEquipment = createTestEquipment(
                "MacBook Pro 16",
                EquipmentType.LAPTOP,
                "Apple",
                "M3 Max",
                EquipmentStatus.AVAILABLE,
                "SN-123456789");

        EquipmentRequest updateRequest = new EquipmentRequest(
                "MacBook Pro 16 (Updated)",
                EquipmentType.LAPTOP,
                "Apple",
                "M3 Max",
                EquipmentStatus.AVAILABLE,
                "SN-123456789");

        mockMvc.perform(put("/api/equipment/{id}", createdEquipment.id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdEquipment.id().toString()))
                .andExpect(jsonPath("$.equipmentName").value("MacBook Pro 16 (Updated)"));
    }

    @Test
    @DisplayName("DELETE /api/equipment/{id} - Should delete existing equipment and return 204 No Content")
    void should_delete_equipment_and_return_204_no_content() throws Exception {
        EquipmentResponse createdEquipment = createTestEquipment(
                "MacBook Pro 16",
                EquipmentType.LAPTOP,
                "Apple",
                "M3 Max",
                EquipmentStatus.AVAILABLE,
                "SN-123456789");

        mockMvc.perform(delete("/api/equipment/{id}", createdEquipment.id()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/equipment/{id}", createdEquipment.id()))
                .andExpect(status().isNotFound());
    }

  }