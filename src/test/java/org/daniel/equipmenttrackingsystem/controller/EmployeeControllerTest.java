package org.daniel.equipmenttrackingsystem.controller;

import jakarta.transaction.Transactional;
import org.daniel.equipmenttrackingsystem.dto.EmployeeRequest;
import org.daniel.equipmenttrackingsystem.dto.EmployeeResponse;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class EmployeeControllerTest {

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

    @Test
    @DisplayName("POST /api/employees - Should create employee and return 201 created")
    void should_create_employee_and_return_201_created() throws Exception{
        EmployeeRequest employeeRequest = new EmployeeRequest(
                "John",
                "Doe",
                "john.doe@example.com",
                "Engineering",
                "Software Engineer",
                LocalDate.of(2023, 1, 15),
                true);

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(employeeRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.department").value("Engineering"))
                .andExpect(jsonPath("$.position").value("Software Engineer"))
                .andExpect(jsonPath("$.hireDate").value("2023-01-15"))
                .andExpect(jsonPath("$.active").value(true));
    }


    @Test
    @DisplayName("POST /api/employees - Should return 400 Bad Requests when validation fails")
    void should_return_400_bad_request_when_validation_fails() throws Exception{
        EmployeeRequest employeeRequest = new EmployeeRequest("",
                "",
                "",
                "",
                "Software Engineer",
                LocalDate.of(2023, 1, 15),
                true);

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(employeeRequest)))
                        .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/employee/{id} - Should return 200 OK when employee exists")
    void should_return_200_ok_when_employee_exists() throws Exception{
        EmployeeResponse employeeResponse = createEmployeeTest(
                "John",
                "Doe",
                "john.doe@example.com",
                "Engineering",
                "Software Engineer",
                LocalDate.of(2023, 1, 15),
                true);

        mockMvc.perform(get("/api/employees/{id}", employeeResponse.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(employeeResponse.id().toString()))
                .andExpect(jsonPath("$.firstName").value(employeeResponse.firstName()))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.department").value("Engineering"))
                .andExpect(jsonPath("$.position").value("Software Engineer"))
                .andExpect(jsonPath("$.hireDate").value("2023-01-15"))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @DisplayName("GET /api/employees/{id} - Should return 404 Not Found when user does not exist")
    void should_return_404_when_user_does_not_exist() throws Exception{
        UUID randomUUID = UUID.randomUUID();

        mockMvc.perform(get("/api/employees/{id}", randomUUID))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/employees - Should return list containing created employees")
    void should_return_list_of_all_users() throws Exception{
         createEmployeeTest(
                "John",
                "Doe",
                "john.doe@example.com",
                "Engineering",
                "Software Engineer",
                LocalDate.of(2023, 1, 15),
                true);

        createEmployeeTest(
                "Johnny",
                "Doe",
                "johnny.doe@example.com",
                "Engineering",
                "Software Engineer",
                LocalDate.of(2023, 1, 15),
                true);

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.content[*].email", hasItems("john.doe@example.com",
                        "johnny.doe@example.com")))
                .andExpect(jsonPath("$.totalElements").value(greaterThanOrEqualTo(2)));
    }

    @Test
    @DisplayName("PUT /api/employees/{id} - Should update existing employee and return 200 OK")
    void should_update_existing_user_and_return_200_OK() throws Exception{
        EmployeeResponse employeeResponse = createEmployeeTest(
                "Johnny",
                "Doe",
                "johnny.doe@example.com",
                "Engineering",
                "Software Engineer",
                LocalDate.of(2023, 1, 15),
                true);
        EmployeeRequest employeeRequest = new EmployeeRequest(
                "Johnny",
                "Doe",
                "johnny.doe@example.com",
                "Engineering",
                "Software Engineer",
                LocalDate.of(2023, 1, 15),
                true
        );

        mockMvc.perform(put("/api/employees/{id}", employeeResponse.id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(employeeRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(employeeResponse.id().toString()))
                .andExpect(jsonPath("$.firstName").value("Johnny"))
                .andExpect(jsonPath("$.email").value("johnny.doe@example.com"));
    }

    @Test
    @DisplayName("DELETE /api/employees/{id} - Should delete existing employee and return 204 No Content")
    void should_delete_existing_employee_and_return_204_no_content() throws Exception{
        EmployeeResponse employeeResponse = createEmployeeTest(
                "Johnny",
                "Doe",
                "johnny.doe@example.com",
                "Engineering",
                "Software Engineer",
                LocalDate.of(2023, 1, 15),
                true);

        mockMvc.perform(delete("/api/employees/{id}", employeeResponse.id()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/employees/{id}", employeeResponse.id()))
                .andExpect(status().isNotFound());
    }


}
