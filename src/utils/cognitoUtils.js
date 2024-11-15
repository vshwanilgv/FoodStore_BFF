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

async function confirmSignUp(username, code) {
    const params = {
        ClientId: clientId,
        Username: username,
        ConfirmationCode: code,
    };
    return cognito.confirmSignUp(params).promise();
}

async function signIn(email, password, username) {
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
    
        ClientId: clientId,
        AuthParameters: {
            USERNAME: username,
            Email: email,
            PASSWORD: password,
        },
    };
    return cognito.initiateAuth(params).promise();
    return response.AuthenticationResult;
}



module.exports = { signUp, confirmSignUp ,signIn};
