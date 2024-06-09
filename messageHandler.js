const jimp = require("jimp");

//currently not used
function messageHandler(topic, payload) {
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
}
module.exports = generateClientId;
