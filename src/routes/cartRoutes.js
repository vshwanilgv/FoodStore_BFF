const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');



router.post("/", cartController.createCart);
router.get("/:cartId", cartController.getCartById);
router.get("/user/:userId", cartController.getCartByUserId);
router.put("/:cartId", cartController.updateCart);
router.delete("/:cartId", cartController.deleteCart);

module.exports = router;