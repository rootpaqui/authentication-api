const { Router } = require("express");

const router = Router();

router.use("/", require("./auth"));
router.use("/api/user", require("./routers/authUserRouter"));

module.exports = router;
