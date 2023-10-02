const router = require("express").Router();

const Controller = require("./order.controller");
const secureAPI = require("../../utils/secure");

// role anusar yo route access garna paune
router.get("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    // const result = await Controller.list();
    const { limit, page, id } = req.query;
    const search = { id };
    const result = await Controller.list(limit, page, search);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    req.body.created_by = req.currentUser;
    const result = await Controller.create(req.body);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", secureAPI(["admin"]), async (req, res, next) => {
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
    req.body.updated_at = new Date();
    const result = await Controller.updateById(req.params.id, req.body);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const payload = { updated_at: new Date(), updated_by: req.currentUser };
    const result = await Controller.removeById(req.params.id, payload);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const payload = {
      status: req.body?.status,
      updated_at: new Date(),
      updated_by: req.currentUser,
    };
    const result = await Controller.approve(req.params.id, payload);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
