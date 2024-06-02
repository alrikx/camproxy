const express = require("express");
const mqtt = require("mqtt");
const config = require("./options.json");

const app = express();
const http_port = 3000;

let buffer = {};

const protocol = config.protocol;
const host = config.host;
const port = config.port;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const user = config.user;
const passwd = config.password;
const inbound_topic = config.inbound_topic;
const content_type = config.content_type;

const connectUrl = `${protocol}://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: user,
  password: passwd,
  reconnectPeriod: 1000,
});

client.on("connect", () => {
  console.log("Connected");
  client.subscribe([inbound_topic], () => {
    console.log(`Subscribe to topic '${inbound_topic}'`);
  });
});

client.on("error", (error) => {
  console.error("connection failed", error);
});

client.on("message", (topic, payload) => {
  console.log("Received Message:", topic, " Lenght: ", payload.length);
  buffer = payload;
});

app.use(express.raw({ type: "*/*", limit: "10mb" }));

app.get("/", (req, res) => {
  res.setHeader("content-type", "image/png");
  res.send(buffer);
});

app.listen(http_port, () => {
  console.log(`Example app listening on port ${http_port}`);
});
