const http = require("http");
const path = require("path");
const express = require("express");
const socketIo = require("socket.io");

const PORT = process.env.PORT || 9000;

function createApp() {
  const app = express();
  app.use(express.static(path.join(__dirname, "public")));
  return app;
}

function createServer() {
  const app = createApp();
  const server = http.createServer(app);
  const io = socketIo(server);

  io.on("connection", function (socket) {
    // Exercise 1: confirm the connection to the client.
    socket.emit("confirm connection", "Connected...");

    // Exercise 1: handle a request from the client and respond.
    socket.on("request", function (msg) {
      console.log(msg);
      socket.emit("response", "Hello from the server");
    });

    // Exercise 2: relay a sent message to every other client.
    socket.on("send message", function (msg) {
      socket.broadcast.emit("received message", msg);
    });
  });

  return { app, server, io };
}

if (require.main === module) {
  const { server } = createServer();
  server.listen(PORT, function () {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = { createApp, createServer };