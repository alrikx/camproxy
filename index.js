const express = require("express");
const mqtt = require("mqtt");

const app = express();
const port = 3000;
let text = "Hello World";

app.use(express.raw({ type: "*/*", limit: "10mb" }));

app.get("/", (req, res) => {
  res.send(text);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
