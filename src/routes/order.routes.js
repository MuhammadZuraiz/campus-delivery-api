const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const validate = require("../middlewares/validate.middleware");
const { createOrderSchema, updateOrderStatusSchema } = require("../validators");

const { createOrder, getMyOrders, updateOrderStatus } = require("../controllers/order.controller");

/**
 * @openapi
 * tags:
 *   - name: Orders
 *     description: Order endpoints
 */

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create an order (customer only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [restaurantId, items]
 *             properties:
 *               restaurantId: { type: integer, example: 1 }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [menuItemId, quantity]
 *                   properties:
 *                     menuItemId: { type: integer, example: 3 }
 *                     quantity: { type: integer, example: 2 }
 *     responses:
 *       201:
 *         description: Order created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

router.post("/", validate(createOrderSchema), authMiddleware, roleMiddleware(["customer"]), createOrder);

/**
 * @openapi
 * /orders/my:
 *   get:
 *     tags: [Orders]
 *     summary: Get my orders (customer only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my orders
 */

router.get("/my", authMiddleware, roleMiddleware(["customer"]), getMyOrders);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (admin or rider)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, example: "delivered" }
 *     responses:
 *       200:
 *         description: Updated order
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

// admin / rider
router.patch("/:id/status", validate(updateOrderStatusSchema), authMiddleware, roleMiddleware(["admin", "rider"]), updateOrderStatus);

module.exports = router;