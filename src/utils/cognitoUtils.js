// bff-layer/utils/cognitoUtils.js

const AWS = require('aws-sdk');
const { clientId, region } = require('../config/cognitoConfig');

AWS.config.update({ region });
const cognito = new AWS.CognitoIdentityServiceProvider();

async function signUp(username, password, attributes) {
    const params = {
        ClientId: clientId,
        Username: username,
        Password: password,
        UserAttributes: attributes.map(attr => ({ Name: attr.name, Value: attr.value })),
    };
    return cognito.signUp(params).promise();
}

module.exports = { signUp };
