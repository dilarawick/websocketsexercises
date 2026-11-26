# websocketsexercises

socket.io exercises covering a basic WebSocket handshake, a multi-user message
board, and a GitHub Actions CI workflow.

## Exercises

### Exercise 1 — WebSockets
A minimal socket.io server and page that demonstrate the four core events:

- `connection` — client establishes the connection
- `confirm connection` — server → client on connect (`Connected...`)
- `request` — client → server with some data
- `response` — server → client acknowledgement (`Hello from the server`)

Open `http://localhost:9000/page.html` to see the messages appear in a list.

### Exercise 2 — Message Board
A shared message board that relays messages between connected clients.

- Server listens for `send message` and re-broadcasts it to every other client
  via `socket.broadcast.emit("received message", ...)` (the sender is excluded).
- The page (`board.html`) appends received messages to the board and, when you
  send, shows your own message immediately and clears the input.

Open `http://localhost:9000/board.html` in several browsers to watch messages
propagate.

### Exercise 3 — GitHub Actions
`.github/workflows/node.js.yml` runs on push/PR to `main` and, for Node 20 and
22, checks out the code, installs dependencies, builds, and runs the tests.

## Project structure

```
server.js                 Express + socket.io server (serves static + socket events)
public/
  index.html              Landing page linking to both exercises
  page.html               Exercise 1 page
  board.html              Exercise 2 page
  board.js / board.css    Exercise 2 client logic and styles
  styles.css              Shared UI theme
test/
  server.test.js          Tests for exercises 1 and 2 (node:test + socket.io-client)
.github/workflows/
  node.js.yml             CI workflow
```

## Getting started

```bash
npm install
npm start          # http://localhost:9000
npm run dev        # same, with nodemon auto-reload
```

Set a custom port with the `PORT` environment variable (default `9000`).

## Tests

```bash
npm test
```

The suite uses the built-in Node test runner and `socket.io-client` to verify
the exercise 1 handshake and the exercise 2 broadcast behaviour.