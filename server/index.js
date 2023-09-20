require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL).then(() => {
  console.log("Database Connected ...");
});

const indexRouter = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  const errMsg = err ? err.toString() : "Something went wrong...";
  res.status(500).json({ data: "", msg: errMsg });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
