const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const { CognitoUserPool, CognitoUser, AuthenticationDetails } = AmazonCognitoIdentity;

const poolData = {
  UserPoolId:  "ap-southeast-1_5BkBqS6TB",
  ClientId:"7ngdf3st3c2d0g366e8c3otlup",
};
const userPool = new CognitoUserPool(poolData);

const cognito = new AWS.CognitoIdentityServiceProvider();

const signUpUser = async(email, password,username, clientId) => {
  attributes={ClientId:"7ngdf3st3c2d0g366e8c3otlup", username,         Password: password,        UserAttributes: [ { Name: 'email', Value: email } ]}

  const res = await cognito.signup(attributes).promise();
  console.log(res);
  console.log(username, email, password);
  // return new Promise((resolve, reject) => {
        
  //      cognito.signUp(attributes, (err, data) => {
  //       const response = {
  //         error: err,
  //         data: data,
  //       };
  //       console.log(response);
  //     });
  // });
};


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
