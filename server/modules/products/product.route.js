const multer = require("multer");
const router = require("express").Router();

const Controller = require("./product.controller");
const secureAPI = require("../../utils/secure");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      cb(null, "./public/products");
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
router.get("/", async (req, res, next) => {
  try {
    // const result = await Controller.list();
    const { limit, page, name, isArchived } = req.query;
    const search = { name, isArchived };
    const result = await Controller.list(limit, page, search);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  secureAPI(["admin"]),
  upload.array("images", 4),
  async (req, res, next) => {
    try {
      if (req.files.length > 0) {
        req.body.images = [];
        req.files.map((file) => {
          req.body.images.push("products/".concat(file.filename));
        });
      }
      const result = await Controller.create(req.body);
      res.json({ data: result, message: "Success" });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/:id", async (req, res, next) => {
  try {
    const result = await Controller.getById(req.params.id);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

router.put(
  "/:id",
  secureAPI(["admin"]),
  upload.array("images", 4),
  async (req, res, next) => {
    try {
      if (req?.files.length > 0) {
        req.body.images = [];
        req.files.map((file) => {
          req.body.images.push("products/".concat(file.filename));
        });
      }
      req.body.updated_by = req.currentUser;
      const result = await Controller.updateById(req.params.id, req.body);
      res.json({ data: result, message: "Success" });
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/:id", secureAPI(["admin"]), async (req, res, next) => {
  try {
    req.body.updated_by = req.currentUser;
    req.body.updated_at = new Date();
    const result = await Controller.removeById(req.params.id, req.body);
    res.json({ data: result, message: "Success" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
