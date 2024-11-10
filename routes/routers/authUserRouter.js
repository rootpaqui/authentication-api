const { Router } = require("express");
const auth = require("../../src/middleware/authenticate");
const { User } = require("../../src/models");

const router = Router();

router.route("/").get(auth, async (request, response) => {
  try {
    const id = request.user;
    const user = await User.findOne({ where: { id } });
    return response.status(200).json({ data: user });
  } catch (error) {
    return response.sendStatus(500);
  }
});

module.exports = router;
