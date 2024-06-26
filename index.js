const express = require("express");
const mqtt = require("mqtt");
const config = require("./data/options.json");
const fs = require("fs");
const jimp = require("jimp");
const clientIdGen = require("./clientidgenerator");

const protocol = config.protocol;
const host = config.host;
const port = config.port;
const clientId = clientIdGen();
const user = config.user;
const passwd = config.password;
const inbound_topic = config.inbound_topic;
const http_port = 3000;
const connectUrl = `${protocol}://${host}:${port}`;
const content_type = "image/jpeg";

let buffer;
let last_modified = new Date();

const app = express();

fs.readFile("./img/servicestarting.jpg", null, (err, data) => {
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

  jimp
    .read(payload)
    .then((image) => {
      // Do stuff with the image.
      image
        //.resize(640, jimp.AUTO) //resize 1200 x 900 --> 640 x 480
        .quality(90)
        .getBufferAsync(jimp.MIME_JPEG)
        .then((image_jpg) => {
          buffer = image_jpg;
          last_modified = new Date();
        });
    })
    .catch((err) => {
      // Handle an exception.
    });
});

app.use(express.raw({ type: "*/*", limit: "10mb" }));

app.get("/image.jpg", (req, res) => {
  res.setHeader("content-type", content_type);
  res.setHeader("cache-control", "public; max-age=60");
  res.header("last-modified", last_modified);
  res.send(buffer);
});

app.listen(http_port, () => {
  console.log(`App listening on port ${http_port}`);
});
