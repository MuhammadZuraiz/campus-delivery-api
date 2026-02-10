const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const {
  createRestaurant,
  getRestaurants
} = require("../controllers/restaurant.controller");

/**
 * @openapi
 * tags:
 *   - name: Restaurants
 *     description: Restaurant endpoints
 */

/**
 * @openapi
 * /restaurants:
 *   post:
 *     tags: [Restaurants]
 *     summary: Create a restaurant (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location]
 *             properties:
 *               name: { type: string, example: "Campus Cafe" }
 *               location: { type: string, example: "NUST H-12" }
 *     responses:
 *       201:
 *         description: Restaurant created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

// admin only
router.post("/", authMiddleware, roleMiddleware(["admin"]), createRestaurant);

/**
 * @openapi
 * /restaurants:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get all restaurants (public)
 *     responses:
 *       200:
 *         description: List of restaurants
 */

// public
router.get("/", getRestaurants);

module.exports = router;