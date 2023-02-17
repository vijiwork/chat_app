const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const db = require("./db");
const src = require("./src");

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
    //origin: true,
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

app.set("port", process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, "./public")));
app.use("/api/v1/", src);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

// socket io
var users = {};
let userlist = [];

io.on("connection", (socket) => {
  console.log("new socket connected", socket.id);

  // handles new connection
  socket.on("new-connection", (data) => {
    //join room
    socket.join(data.roomname);
    userlist.push({
      socket_id: socket.id,
      username: data.username,
      roomname: data.roomname,
    });
    users[socket.id] = data.username;

    console.log("users :>> ", users);
    // emit welcome message event
    socket.emit("welcome-message", {
      user: "server",
      roomname: data.roomname,
      message: `Welcome ${data.username},  Chat Room :${data.roomname}`,
    });
  });

  // handles message posted by client
  socket.on("new-message", (data) => {
    if (userlist.length != 0) {
      let usid = userlist.filter((d) => d.socket_id === data.user);
      if (usid.length != 0) {
        socket.to(usid[0].roomname).emit("broadcast-message", {
          user: users[data.user],
          message: data.message,
          roomname: usid[0].roomname,
        });
      }
    }
  });
});

server.listen(app.get("port"), () => {
  console.log(`App listening on port ${app.get("port")}`);
});
