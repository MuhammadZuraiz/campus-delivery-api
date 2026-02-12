const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate.middleware");
const { createMenuItemSchema } = require("../validators");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const { createMenuItem, getMenuByRestaurant } = require("../controllers/menuItem.controller");

/**
 * @openapi
 * tags:
 *   - name: MenuItems
 *     description: Menu item endpoints
 */

/**
 * @openapi
 * /menu-items:
 *   post:
 *     tags: [MenuItems]
 *     summary: Create a menu item (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, restaurantId]
 *             properties:
 *               name: { type: string, example: "Burger" }
 *               price: { type: number, example: 450 }
 *               restaurantId: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Menu item created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

// admin only
router.post("/", validate(createMenuItemSchema), authMiddleware, roleMiddleware(["admin"]), createMenuItem);

/**
 * @openapi
 * /menu-items/restaurant/{id}:
 *   get:
 *     tags: [MenuItems]
 *     summary: Get menu items for a restaurant (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of menu items
 */

// public
router.get("/restaurant/:id", getMenuByRestaurant);

module.exports = router;