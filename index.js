const express = require("express");
const mqtt = require("mqtt");
const config = require("./data/options.json");
const fs = require("fs");
const jimp = require("jimp");

const protocol = config.protocol;
const host = config.host;
const port = config.port;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const user = config.user;
const passwd = config.password;
const inbound_topic = config.inbound_topic;
const http_port = 3000;
const connectUrl = `${protocol}://${host}:${port}`;
const content_type = "image/jpeg";

let buffer = {};

const app = express();

fs.readFile("./data/servicestarting.jpg", null, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  buffer = data;
  console.log("read startup image");
});

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
  content_type = config.content_type;

  jimp
    .read(payload)
    .then((image) => {
      // Do stuff with the image.
      image
        .quality(80)
        .getBufferAsync(jimp.MIME_JPEG)
        .then((image_jpg) => {
          buffer = image_jpg;
        });
    })
    .catch((err) => {
      // Handle an exception.
    });

  buffer = payload;
});

app.use(express.raw({ type: "*/*", limit: "10mb" }));

app.get("/", (req, res) => {
  res.setHeader("content-type", content_type);
  res.send(buffer);
});

app.listen(http_port, () => {
  console.log(`App listening on port ${http_port}`);
});
