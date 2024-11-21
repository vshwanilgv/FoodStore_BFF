const axios = require("axios");
const logger = require("../utils/logger");

const BASE_URL ="http://localhost:8088/api/v1/carts"; 


exports.createCart = async (req, res, next) => {
  try {
    const { userId, productIds, totalPrice } = req.body;

    if (!userId || !productIds || totalPrice == null) {
      return res.status(400).json({
        error: "User ID, Product IDs, and Total Price are required.",
      });
    }

    const response = await axios.post(BASE_URL, {
      userId,
      productIds,
      totalPrice,
    });

    res.status(201).json(response.data);
  } catch (error) {
    logger.error(`Error creating cart: ${error.message}`);
    next(error);
  }
};


exports.getCartById = async (req, res, next) => {
  try {
    const { cartId } = req.params;

    const response = await axios.get(`${BASE_URL}/${cartId}`);
    res.status(200).json(response.data);
  } catch (error) {
    logger.error(`Error fetching cart with ID ${req.params.cartId}: ${error.message}`);
    next(error);
  }
};


exports.getCartByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
   
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    res.status(200).json(response.data);
  } catch (error) {
    logger.error(`Error fetching cart for user ID ${userId}: ${error.message}`);
    next(error);
  }
};

exports.updateCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { userId, productIds, totalPrice } = req.body;

    if (!productIds || totalPrice == null || !userId) {
      return res.status(400).json({
        error: "Product IDs,User IDs and Total Price are required.",
      });
    }

    const response = await axios.put(`${BASE_URL}/${cartId}`, {
      userId, 
      productIds,
      totalPrice,
    });

    res.status(200).json(response.data);
  } catch (error) {
    logger.error(`Error updating cart with ID ${cartId}: ${error.message}`);
    next(error);
  }
};


exports.deleteCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;

    await axios.delete(`${BASE_URL}/${cartId}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting cart with ID ${cartId}: ${error.message}`);
    next(error);
  }
};
