package org.daniel.equipmenttrackingsystem.controller;

import jakarta.transaction.Transactional;
import org.daniel.equipmenttrackingsystem.dto.UserRequest;
import org.daniel.equipmenttrackingsystem.dto.UserResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser(username = "admin", roles = "ADMIN")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private UserRequest createRequest(
            String email,
            String password
    ) {
        return new UserRequest(
                email,
                password,
                SignupRole.MANAGER,
                null,
                null,
                null,
                null,
                null
        );
    }

    private UserResponse createTestUser(
            String email,
            String password
    ) throws Exception {

        UserRequest request = createRequest(email, password);

        MvcResult result = mockMvc.perform(
                        post("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readValue(
                result.getResponse().getContentAsString(),
                UserResponse.class
        );
    }

    @Test
    @DisplayName("POST /api/users - Should create user and return 201 Created")
    void should_return_201_created_when_user_is_created() throws Exception {

        UserRequest request = createRequest(
                "johndoe@example.com",
                "password123"
        );

        mockMvc.perform(
                        post("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.email")
                        .value("johndoe@example.com"));
    }

    @Test
    @DisplayName("POST /api/users - Should return 400 Bad Request when validation fails")
    void should_return_400_bad_request_when_validation_fails() throws Exception {

        UserRequest invalidRequest = new UserRequest(
                "",
                "",
                SignupRole.MANAGER,
                null,
                null,
                null,
                null,
                null
        );

        mockMvc.perform(
                        post("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidRequest))
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/users - Should return 400 Bad Request when email is invalid")
    void should_return_400_bad_request_when_email_is_invalid() throws Exception {

        UserRequest invalidRequest = new UserRequest(
                "invalid-email",
                "password123",
                SignupRole.MANAGER,
                null,
                null,
                null,
                null,
                null
        );

        mockMvc.perform(
                        post("/api/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidRequest))
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/users/{id} - Should return 200 OK when user exists")
    void should_return_200_ok_when_user_exists() throws Exception {

        UserResponse createdUser = createTestUser(
                "johndoe@example.com",
                "password123"
        );

        mockMvc.perform(
                        get("/api/users/{identifier}", createdUser.id())
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value(createdUser.id().toString()))
                .andExpect(jsonPath("$.email")
                        .value("johndoe@example.com"));
    }

    @Test
    @DisplayName("GET /api/users/{id} - Should return 404 Not Found when user does not exist")
    void should_return_404_not_found_when_user_doesnt_exist() throws Exception {

        UUID randomId = UUID.randomUUID();

        mockMvc.perform(
                        get("/api/users/{identifier}", randomId)
                )
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/users/{email} - Should return 200 OK when email exists")
    void should_return_200_ok_when_user_email_exists() throws Exception {

        UserResponse createdUser = createTestUser(
                "johndoe@example.com",
                "password123"
        );

        mockMvc.perform(
                        get("/api/users/{identifier}",
                                "johndoe@example.com")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value(createdUser.id().toString()))
                .andExpect(jsonPath("$.email")
                        .value("johndoe@example.com"));
    }

    @Test
    @DisplayName("GET /api/users/{email} - Should return 404 Not Found when email does not exist")
    void should_return_404_not_found_when_email_doesnt_exist() throws Exception {

        mockMvc.perform(
                        get("/api/users/{identifier}",
                                "doesnotexist@example.com")
                )
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/users - Should return list containing created users")
    void should_return_list_of_users() throws Exception {

        createTestUser(
                "johndoe@example.com",
                "password123"
        );

        createTestUser(
                "johnnydoe@example.com",
                "password123"
        );

        mockMvc.perform(
                        get("/api/users")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$",
                        hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$[*].email",
                        hasItems(
                                "johndoe@example.com",
                                "johnnydoe@example.com"
                        )));
    }

    @Test
    @DisplayName("PUT /api/users/{id} - Should update existing user and return 200 OK")
    void should_update_user_and_return_200_ok() throws Exception {

        UserResponse createdUser = createTestUser(
                "johndoe@example.com",
                "password123"
        );

        UserRequest updateRequest = createRequest(
                "johnnydoe@example.com",
                "newpassword123"
        );

        mockMvc.perform(
                        put("/api/users/{id}", createdUser.id())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value(createdUser.id().toString()))
                .andExpect(jsonPath("$.email")
                        .value("johnnydoe@example.com"));
    }

    @Test
    @DisplayName("DELETE /api/users/{id} - Should delete existing user and return 204 No Content")
    void should_delete_user_and_return_204_no_content() throws Exception {

        UserResponse createdUser = createTestUser(
                "johndoe@example.com",
                "password123"
        );

        mockMvc.perform(
                        delete("/api/users/{id}", createdUser.id())
                )
                .andExpect(status().isNoContent());

        mockMvc.perform(
                        get("/api/users/{identifier}", createdUser.id())
                )
                .andExpect(status().isNotFound());
    }
}
