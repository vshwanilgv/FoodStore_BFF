const axios = require("axios");
const logger = require("../utils/logger");

const BASE_URL = "http://localhost:8088/api/v1/cart"; 

// Create a new cart for the user
exports.createCart = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated after authentication
    const response = await axios.post(`${BASE_URL}/${userId}`);
    res.status(201).json(response.data);
  } catch (error) {
    logger.error(`Error creating cart for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};

// Get all cart items for the user
exports.getCartItems = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated after authentication
    const response = await axios.get(`${BASE_URL}/${userId}`);
    res.json(response.data);
  } catch (error) {
    logger.error(`Error fetching cart items for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};

// Add a product to the cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const response = await axios.post(`${BASE_URL}/${userId}/add`, {
      productId,
      quantity,
    });

    res.status(201).json(response.data);
  } catch (error) {
    logger.error(`Error adding product to cart for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const response = await axios.put(`${BASE_URL}/${userId}/update/${cartItemId}`, {
      quantity,
    });

    res.json(response.data);
  } catch (error) {
    logger.error(`Error updating cart item ${cartItemId} for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};

// Remove an item from the cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.user.id;

    await axios.delete(`${BASE_URL}/${userId}/remove/${cartItemId}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error removing cart item ${cartItemId} for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};

// Clear the entire cart
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await axios.delete(`${BASE_URL}/${userId}/clear`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error clearing cart for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};
