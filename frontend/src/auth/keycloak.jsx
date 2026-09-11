import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8082',
    realm: 'equipment-tracker',
    clientId: 'equipment-frontend'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;