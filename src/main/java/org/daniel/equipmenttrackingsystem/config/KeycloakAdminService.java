package org.daniel.equipmenttrackingsystem.config;

import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.daniel.equipmenttrackingsystem.dto.UserRequest;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class KeycloakAdminService {

    @Value("${keycloak.server-url}")
    private String keycloakServerUrl;

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;

    @Value("${keycloak.admin-client-id}")
    private String adminClientId;

    @Value("${keycloak.realm}")
    private String realm;

    public void createAdminUser(UserRequest request) {
        createUserWithRole(request, "ADMIN");
    }

    public void createEmployeeUser(UserRequest request) {
        createUserWithRole(request, "EMPLOYEE");
    }

    public void deleteUserByEmail(String email) {
        try (Keycloak keycloak = getAdminClient()) {
            RealmResource realmResource = keycloak.realm(realm);

            List<UserRepresentation> users = realmResource.users().searchByEmail(email, true);

            if (!users.isEmpty()) {
                String userId = users.get(0).getId();
                realmResource.users().get(userId).remove();
            }
        }
    }

    private void createUserWithRole(UserRequest request, String roleName) {

        try (Keycloak keycloak = getAdminClient()) {

            RealmResource realmResource = keycloak.realm(realm);

            ensureRealmRole(realmResource, roleName);

            UserRepresentation user = new UserRepresentation();
            user.setUsername(request.email());
            user.setEmail(request.email());
            user.setEnabled(true);
            user.setEmailVerified(true);
            user.setRequiredActions(Collections.emptyList());

            CredentialRepresentation credentials = new CredentialRepresentation();
            credentials.setType(CredentialRepresentation.PASSWORD);
            credentials.setValue(request.password());
            credentials.setTemporary(false);

            user.setCredentials(Collections.singletonList(credentials));

            Response response = realmResource.users().create(user);

            try {
                if (response.getStatus() != 201) {
                    String errorMessage;
                    try {
                        errorMessage = response.readEntity(String.class);
                    } catch (Exception e) {
                        errorMessage = response.getStatusInfo().toString();
                    }
                    throw new RuntimeException(
                            "Failed to create user in Keycloak: "
                                    + response.getStatus() + " - " + errorMessage
                    );
                }

                String userId = extractUserId(response);
                assignRole(realmResource, userId, roleName);

            } finally {
                response.close();
            }
        }
    }

    private Keycloak getAdminClient() {
        return KeycloakBuilder.builder()
                .serverUrl(keycloakServerUrl)
                .realm("master")
                .clientId(adminClientId)
                .username(adminUsername)
                .password(adminPassword)
                .grantType(OAuth2Constants.PASSWORD)
                .build();
    }

    private void ensureRealmRole(RealmResource realmResource, String roleName) {
        try {
            realmResource.roles().get(roleName).toRepresentation();
        } catch (NotFoundException e) {
            RoleRepresentation role = new RoleRepresentation();
            role.setName(roleName);
            realmResource.roles().create(role);
        }
    }

    private void assignRole(RealmResource realmResource,
                            String userId,
                            String roleName) {
        RoleRepresentation role = realmResource
                .roles()
                .get(roleName)
                .toRepresentation();

        realmResource
                .users()
                .get(userId)
                .roles()
                .realmLevel()
                .add(List.of(role));
    }

    private String extractUserId(Response response) {
        String location = response.getHeaderString("Location");
        if (location == null) {
            throw new RuntimeException(
                    "Keycloak did not return the created user's ID."
            );
        }
        return location.substring(location.lastIndexOf("/") + 1);
    }
}