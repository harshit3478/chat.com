const express = require("express");
require("dotenv").config();

const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { mongoconnect } = require("./mongoose/main.js");
const path = require("path");
const { userAuth } = require("./middleware/auth.js");



//socket.io server
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/javascript", express.static("./javascript"));
app.use("/css", express.static("./css"));
app.use(cookieParser());

// Parse JSON requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5000/",
    credentials: true,
  })
);

//Routes
app.use("/api/auth", require("./auth/router.js"));

// Connect to MongoDB
mongoconnect();
// dbconnect();
//to log body parsing errors
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).send();
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});



  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/index.html");
  });
  

// Define routes

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/html/signup.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/html/login.html");
});
app.get("/home", userAuth, (req, res) => {
  
  res.sendFile(__dirname + "/html/mainpage.html");
});
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });

  res.redirect("/");
});
// WebSocket logic

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.broadcast.emit("newuser", "connected");

  socket.on("disconnect", async () => {
    // socket.broadcast.emit("userleft", "disconnected");
    await socket.on("Offline", (username) => {
      const userName = username+"offline";
      console.log(userName)
      socket.broadcast.emit(userName);
    });
    console.log("a user disconnected");
  });

  socket.on("sendingMSG", (msg, userName, userEmail) => {
    socket.broadcast.emit(userName, msg);
    console.log(msg, userName);
  });
  socket.on("chat-message", (msg) => {
    console.log("message: " + msg);
    socket.broadcast.emit("new-message", msg);
    console.log("countcheck");
  });

  socket.on("Online", (username) => {
    const userName = username+"online";
    socket.broadcast.emit(userName);
  });

  socket.on("typing", (username) => {
    const userName = username+"typing";
    socket.broadcast.emit(userName);
  });
});

// Start the server

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;