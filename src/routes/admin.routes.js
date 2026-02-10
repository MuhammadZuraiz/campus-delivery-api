const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin-only endpoints
 */

/**
 * @openapi
 * /admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Admin dashboard (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome admin
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */

router.get("/dashboard", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
    res.json({
      message: "Welcome admin",
      user: req.user
    });
  });

module.exports = router;