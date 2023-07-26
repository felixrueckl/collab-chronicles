const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // oclient origin
    methods: ["GET", "POST"],
  },
});

let rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("createRoom", (data) => {
    console.log(
      `Room ${data.storyId} created with max authors of ${data.maxAuthors}.`
    );
    const { storyId, maxAuthors, authors } = data;
    if (storyId && !rooms.hasOwnProperty(storyId)) {
      rooms[storyId] = { users: authors, maxAuthors };
      socket.join(storyId);
    }
  });

  socket.on("joinRoom", ({ storyId, userId }) => {
    if (!rooms[storyId]) {
      socket.emit("roomError", { message: "Room does not exist." });
      return;
    }
    const room = rooms[storyId];
    // handle cases when maxAuthors is not defined
    const maxAuthors = room.maxAuthors || Infinity;
    if (!room.users.includes(userId)) {
      // If the room is full, emit an error and return
      if (room.users.length >= maxAuthors) {
        socket.emit("roomError", { message: "Room is full." });
        return;
      }

      room.users.push(userId);
      socket.join(storyId);
      console.log(`User ${userId} has joined the room ${storyId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
});

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
