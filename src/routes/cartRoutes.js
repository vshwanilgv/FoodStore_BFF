const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.createCart);
router.get('/:userId', cartController.getCartItems);
router.post('/:userId/add', cartController.addToCart);
router.put('/:userId/update/:cartItemId', cartController.updateCartItem);
router.delete('/:userId/remove/:cartItemId', cartController.removeFromCart);
router.delete('/:userId', cartController.clearCart);
