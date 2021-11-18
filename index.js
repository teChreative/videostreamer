// https://dev.to/abdisalan_js/how-to-code-a-video-streaming-server-using-nodejs-2o0
// companion link - https://www.youtube.com/watch?v=ZjBLbXUuyWg
/*eslint-env es6*/
const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", function (req, res) {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  // // get video stats
  const videoPath = "alien.mp4";
  const videoSize = fs.statSync("alien.mp4").size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Typee": "video/mp4",
  };

  // HTTP Status 206 for partial content
  res.writeHead(206, headers);

  // Create video read stream for this chunk
  const videoStream = fs.createReadStream(videoPath, {start, end});

  // Stream the video chunk to the client
  videoStream.pipe(res);

});

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});
