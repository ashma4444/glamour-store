const router = require("express").Router();
const authRouter = require("../modules/auth/auth.route");
const userRouter = require("../modules/users/user.route");
const roleRouter = require("../modules/roles/role.route");

router.get("/", (req, res, next) => {
  res.json({ data: "", msg: "API routes are working" });
});

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/roles", roleRouter);

// define gareko vanda aru routes ma gayo vani
router.all("*", (req, res, next) => {
  try {
    res.json({ data: "", msg: "Routes are not defined" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
