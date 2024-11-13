const axios = require('axios');
const BASE_URL = "http://localhost:8080/api/v1/users"; 
const logger = require('../utils/logger');
const FormData = require('form-data');
const { signUp } = require('../utils/cognitoUtils');

const fs = require('fs');


exports.signUp = async (req, res) => {
    const { username, email, password } = req.body;
    // Validate input data
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
    }
  
    try {
        // Call Cognito to create the user
        const data = await signUp(username, password, [{ name: 'email', value: email }]);
        const cognitoId = data.UserSub;

        try{
        // Create user in the user service backend
        console.log("Creating user in backend with data:", { cognitoId, email });
        const response = await axios.post(`${BASE_URL}`, {
            cognitoId,
            email
        });
            // Return success response to frontend
        res.status(201).json({ message: "User created successfully", cognitoId });
        }catch(error){
            if (error.response) {
                console.error("Error creating user in backend:", error.response.data);
                res.status(500).json({ error: error.response.data });
            } else {
                console.error("Error creating user in backend:", error.message);
                res.status(500).json({ error: "Error creating user in backend" });
            }
        }
        
        
    } catch (error) {
        console.error("Error signing up user:", error.message);
        res.status(400).json({ error: error.message });
    }
  };

exports.signIn = async (req, res) => {
    const { username, email, password } = req.body;

    
  
    try {
      const tokens = await signInUser(username, email, password);
      res.status(200).json(tokens);
      
    } catch (error) {
      res.status(401).json({ message: 'Invalid credentials', error: error.message });
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const response = await axios.get(`${BASE_URL}`);
        res.json(response.data);
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`);
        next(error);
    }
};


exports.getUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        res.json(response.data);
    } catch (error) {
        logger.error(`Error fetching user by ID: ${id} - ${error.message}`);
        next(error);
    }
};


// exports.createUser = async (req, res, next) => {
//     try {
//         const formData = new FormData();
//         const { userGroup } = req.user;
//         if (!userGroup.includes('Admin')) {
//             return res.status(403).json({ message: 'Forbidden: Admins only' });
//           }
        
//         formData.append('username', req.body.username);
//         formData.append('userId', req.body.userId);
//         formData.append('cognitoId', req.body.cognitoId);
//         try{
//             const response = await axios.post(`${BASE_URL}`, formData, {
//                 headers: {
//                     ...formData.getHeaders(),
//                 },
//             });
//         }catch(error){
//             logger.error(`Error creating user: ${error.message}`);
//             next(error);
//         }
        
//         res.status(201).json(response.data);
//     } catch (error) {
//         logger.error(`Error creating user: ${error.message}`);
//         next(error);
//     }
// };


exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const formData = new FormData();


        formData.append('username', req.body.username);
        formData.append('userId', req.body.userId);

        const response = await axios.put(`${BASE_URL}/${id}`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        res.json(response.data);
    } catch (error) {
        logger.error(`Error updating user by ID: ${id} - ${error.message}`);
        next(error);
    }
};


exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const { userGroup } = req.user;

    if (!userGroup.includes('Admin')) {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    try {
        await axios.delete(`${BASE_URL}/${id}`);
        res.status(204).send();
    } catch (error) {
        logger.error(`Error deleting user by ID: ${id} - ${error.message}`);
        next(error);
    }
};

exports.getUserDetails = async (req, res) => {
    try {
      const { userId, cognitoId } = req.user; 
  
      const response = await axiosInstance.post('/process-user', {
        userId,
        cognitoId
      });
  
      return res.json(response.data);
    } catch (error) {
      return res.status(500).json({ message: 'Error processing user' });
    }
  };
