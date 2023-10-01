const multer = require("multer");
const router = require("express").Router();
const Controller = require("./user.controller");
const secureAPI = require("../../utils/secure");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      cb(null, "./public/users");
    } catch (e) {}
  },
  filename: function (req, file, cb) {
    try {
      const uniqueSuffix = Date.now() + file.originalname.split(" ").join("");
      cb(null, file.fieldname + "-" + uniqueSuffix);
    } catch (e) {}
  },
});

const upload = multer({ storage: storage });

// role anusar yo route access garna paune
router.get("/", secureAPI(["admin"]), async (req, res, next) => {
  try {
    // const result = await Controller.list();
    const { limit, page, name, role } = req.query;
    const search = { name, role };
    const result = await Controller.list(limit, page, search);
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

router.get("/profile", secureAPI(["user", "admin"]), async (req, res, next) => {
  try {
    const me = req.currentUser;
    const result = await Controller.getById(me);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.put(
  "/update-profile",
  secureAPI(["user", "admin"]),
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (req?.file) {
        req.body.image = "users/".concat(req?.file.filename);
      }
      const me = req.currentRoles.includes("admin")
        ? req.body.id
        : req.currentUser;
      const result = await Controller.updateById(me, req.body);
      res.json({ data: result, message: "Success" });
    } catch (e) {
      next(e);
    }
  }
);

router.put("/change-password", secureAPI(["user"]), async (req, res, next) => {
  try {
    const me = req.currentUser;
    const { oldPass, newPass } = req.body;

    if (!oldPass || !newPass) throw new Error("Password are missing");

    const result = await Controller.changePassword(me, oldPass, newPass);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.put("/reset-password", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const me = req.body.id;
    const { newPass } = req.body;

    if (!newPass) throw new Error("Password are missing");

    const result = await Controller.resetPassword(me, newPass);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.patch("/status/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const me = req.params.id;
    const result = await Controller.block(me, req.body);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    const me = req.params.id;
    const result = await Controller.archive(me, req.body);
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
