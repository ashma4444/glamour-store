const router = require("express").Router();
const Controller = require("./user.controller");
const secureAPI = require("../../utils/secure");

// role anusar yo route access garna paune
router.get("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await Controller.list();
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.post("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    req.body.created_by = req.currentUser;
    req.body.updated_by = req.currentUser;
    const result = await Controller.create(req.body);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.get("/profile", secureAPI(["user"]), async (req, res, next) => {
  try {
    const me = req.currentUser;
    const result = await Controller.getById(me);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", secureAPI(["admin", "user"]), async (req, res, next) => {
  try {
    const result = await Controller.getById(req.params.id);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
