const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

server = app.listen(process.env.PORT || 8080);

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.username = "Anonymous";

  socket.on("change_username", (data) => {
    socket.username = data.username;
  });

  socket.on("new_message", (data) => {
    if (data.type === "text") {
      io.sockets.emit("new_message", {
        type: "text",
        content: data.content,
        username: socket.username,
      });
    } else if (data.type === "file") {
      io.sockets.emit("new_message", {
        type: "file",
        content: data.content,
        username: socket.username,
      });
    }
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing", { username: socket.username });
  });
});

