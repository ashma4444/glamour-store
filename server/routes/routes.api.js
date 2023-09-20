const router = require("express").Router();
const userRouter = require("../modules/users/user.api");

router.get("/", (req, res, next) => {
  res.json({ data: "", msg: "API routes are working" });
});

router.use("/users", userRouter);

// define gareko vanda aru routes ma gayo vani
router.all("*", (req, res, next) => {
  try {
    res.json({ data: "", msg: "Routes are not defined" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
