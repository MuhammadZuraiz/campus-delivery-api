const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @openapi
 * tags:
 *   - name: Protected
 *     description: Protected endpoints requiring JWT
 */

/**
 * @openapi
 * /protected/me:
 *   get:
 *     tags: [Protected]
 *     summary: Get current authenticated user from JWT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user info
 *       401:
 *         description: Unauthorized
 */

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user
  });
});

module.exports = router;