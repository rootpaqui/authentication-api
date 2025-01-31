const { Router } = require("express");
const authController = require("../src/controllers/authController");

const router = Router();

router.post("/api/register", authController.register);
router.post("/api/login", authController.login);
router.get("/api/refresh-token", authController.refreshToken);
router.post("/api/logout", authController.logout);

module.exports = router;
