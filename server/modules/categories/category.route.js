const router = require("express").Router();

const Controller = require("./category.controller");
const secureAPI = require("../../utils/secure");

// role anusar yo route access garna paune
router.get("/", secureAPI([]), async (req, res, next) => {
  try {
    // const result = await Controller.list();
    const { size, offset, name } = req.query;
    const search = { name };
    const result = await Controller.list(size, offset, search);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.post("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    req.body.created_by = req.currentUser;
    const result = await Controller.create(req.body);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", secureAPI([]), async (req, res, next) => {
  try {
    const result = await Controller.getById(req.params.id);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    req.body.updated_by = req.currentUser;
    const result = await Controller.updateById(req.params.id, req.body);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const result = await Controller.removeById(req.params.id);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
