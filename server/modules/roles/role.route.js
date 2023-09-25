const router = require("express").Router();

const controller = require("./role.controller");

router.post("/", async (req, res, next) => {
  try {
    const { user, role } = req.body;
    if (!user || !role) throw new Error("User or role does not exists");

    const result = await controller.create(req.body);
    res.send({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
