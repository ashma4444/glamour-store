const router = require("express").Router();
const Controller = require("./user.controller");

router.post("/", async (req, res, next) => {
  try {
    const result = await Controller.create(req.body);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body; // controller bata email , password nikaleko
    if (!email || !password) throw new Error("Username or password is missing");

    const result = await Controller.login(email, password);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
