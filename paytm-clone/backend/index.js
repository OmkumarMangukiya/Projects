/* eslint-disable no-undef */
const express = require("express");
const mainRouter = require("./routes/index");
const cors = require("cors");

const app = express();
//cors authorization
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept,authorization");
  next();
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});