const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const { CognitoUserPool, CognitoUser, AuthenticationDetails } = AmazonCognitoIdentity;

const poolData = {
  UserPoolId:  "ap-southeast-1_5BkBqS6TB",
  ClientId:"7ngdf3st3c2d0g366e8c3otlup",
};
const userPool = new CognitoUserPool(poolData);

// Sign up a new user
const signUpUser = (email, password) => {
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, [], null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.user);
      }
    });
  });
};

// Sign in an existing user
const signInUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve({
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
        });
      },
      onFailure: (err) => {
        reject(err);
      }
    });
  });
};

// Validate JWT token
const validateToken = (token) => {
  return new Promise((resolve, reject) => {
    AWS.config.region = process.env.COGNITO_REGION;
    const cognitoIssuer = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;
    
    const params = {
      Token: token
    };

    const cognitoIdentityService = new AWS.CognitoIdentityServiceProvider();
    cognitoIdentityService.getUser(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = { signUpUser, signInUser, validateToken };
