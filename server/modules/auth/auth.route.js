const router = require("express").Router();
const Controller = require("./auth.controller");

router.post("/register", async (req, res, next) => {
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

router.post("/verify", async (req, res, next) => {
  try {
    const { email, token } = req.body; // controller bata email , password nikaleko
    if (!email || !token) throw new Error("Username or token is missing");

    const result = await Controller.verifyEmail(email, token);

    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.post("/regenerate", async (req, res, next) => {
  try {
    const { email } = req.body; // controller bata email , password nikaleko
    if (!email) throw new Error("Email is missing");

    const result = await Controller.regenerateToken(email);

    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.put("/forgot-password", async (req, res, next) => {
  try {
    const { email, password, token } = req.body; // controller bata email , password nikaleko
    if (!email || !password || !token)
      throw new Error("Email, token or password is missing");

    const result = await Controller.forgotPassword(email, token, password);

    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
