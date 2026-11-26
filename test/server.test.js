const test = require("node:test");
const assert = require("node:assert");
const { createServer } = require("../server");
const { io: ioClient } = require("socket.io-client");

function startServer() {
  return new Promise((resolve) => {
    const { server } = createServer();
    server.listen(0, function () {
      resolve({ server, port: server.address().port });
    });
  });
}

function connect(port) {
  return ioClient(`http://localhost:${port}`, {
    transports: ["websocket"],
    forceNew: true,
  });
}

function once(socket, event) {
  return new Promise((resolve) => socket.once(event, resolve));
}

function waitForConnect(socket) {
  if (socket.connected) return Promise.resolve();
  return new Promise((resolve) => socket.once("connect", resolve));
}

test("exercise 1: confirm connection, request and response", async (t) => {
  const { server, port } = await startServer();
  t.after(() => server.close());

  const socket = connect(port);
  t.after(() => socket.close());

  // Register listeners synchronously so no early event is missed.
  const confirmed = once(socket, "confirm connection");
  const response = once(socket, "response");

  await waitForConnect(socket);
  socket.emit("request", "Hello from the client");

  assert.strictEqual(await confirmed, "Connected...");
  assert.strictEqual(await response, "Hello from the server");
});

test("exercise 2: broadcast a sent message to other clients only", async (t) => {
  const { server, port } = await startServer();
  t.after(() => server.close());

  const sender = connect(port);
  const receiver = connect(port);
  t.after(() => sender.close());
  t.after(() => receiver.close());

  const received = once(receiver, "received message");
  let senderGotMessage = false;
  sender.once("received message", () => {
    senderGotMessage = true;
  });

  await Promise.all([waitForConnect(sender), waitForConnect(receiver)]);
  sender.emit("send message", "Hello board");

  assert.strictEqual(await received, "Hello board");
  assert.strictEqual(senderGotMessage, false);
});