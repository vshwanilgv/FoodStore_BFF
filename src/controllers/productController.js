const axios = require('axios');
const BASE_URL ="http://localhost:8081/api/v1/products";
const logger = require('../utils/logger')
const FormData = require('form-data');
const fs = require('fs');

exports.getAllProducts = async (req, res,next) => {
    try {
        const response = await axios.get(`${BASE_URL}`);
        res.json(response.data);
    } catch (error) {
        logger.error(`Error fetching products: ${error.message}`);
        next(error);
    }
};

exports.getProductById = async (req, res ,next) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        res.json(response.data);
    } catch (error) {
        logger.error(`Error fetching product by ID: ${id} - ${error.message}`);
        next(error);
    }
};

exports.createProduct = async (req, res,next) => {
    try {
        const formData = new FormData();
        
        // Append fields
        formData.append('name', req.body.name);
        formData.append('description', req.body.description);
        formData.append('price', req.body.price);

        // Append the image file if exists
        if (req.file) {
            formData.append('image', fs.createReadStream(req.file.path));
        }

        const response = await axios.post(`${BASE_URL}`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        res.status(201).json(response.data);
    } catch (error) {
        logger.error(`Error creating product: ${error.message}`);
        next(error);
    }
};

exports.updateProduct = async (req, res,next) => {
    const { id } = req.params;
    try {
        const formData = new FormData();

        // Append fields
        formData.append('name', req.body.name);
        formData.append('description', req.body.description);
        formData.append('price', req.body.price);

        // Append the image file if exists
        if (req.file) {
            formData.append('image', fs.createReadStream(req.file.path));
        }

        const response = await axios.put(`${BASE_URL}`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        res.json(response.data);
    } catch (error) {
        logger.error(`Error updating product by ID: ${id} - ${error.message}`);
        next(error);
    }
};

exports.deleteProduct = async (req, res,next) => {
    const { id } = req.params;
    try {
        await axios.delete(`${BASE_URL}/${id}`);
        res.status(204).send();
    } catch (error) {
        logger.error(`Error deleting product by ID: ${id} - ${error.message}`);
        next(error);
    }
};