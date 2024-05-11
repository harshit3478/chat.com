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
const { userAuth, resetAuth } = require("./middleware/auth.js");
const sgMail = require('@sendgrid/mail');



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
const allowedOrigins = ["https://kgp-connect.onrender.com", "http://192.168.164.183:5000", "http://localhost:5000"];

app.use(
  cors(
  //   {
  //   origin: function (origin, callback) {
  //     // Check if the origin is in the list of allowed origins or if it's not defined (e.g., a same-origin request)
  //     if (!origin || allowedOrigins.includes(origin)) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error("Not allowed by CORS"));
  //     }
  //   },
  //   credentials: true,
  // }
)
);

//Routes
app.use("/api/auth", require("./auth/router.js"));

// Connect to MongoDB
mongoconnect();
// dbconnect();
//to log body parsing errors
// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.status(200).send();
// });
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});





// Define routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});
app.get('/reset' , (req, res)=>{
  res.sendFile(__dirname + '/html/forgot.html')
})

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/html/signup.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/html/login.html");
});
app.get("/home", userAuth, (req, res) => {
  
  res.sendFile(__dirname + "/html/mainpage.html");
});
app.get('/resetpassword' , resetAuth , (req ,res)=>{
  // res.cookie("jwt", "", { maxAge: 1 });
  res.sendFile(__dirname + '/html/changepassword.html')
})
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
    await socket.on("Offline", (data) => {
      const userName = data.sender+"offline";
      console.log(userName)
      socket.broadcast.emit(userName ,data.receiver );
    });
    console.log("a user disconnected");
  });

  // socket.on("sendingMSG", (msg, userName, userEmail) => {
  //   socket.broadcast.emit(userName, msg);
  //   console.log(msg, userName);
  // });
  socket.on("sendingMSG", (data) => {
    console.log("message: " + data.msg);
    socket.broadcast.emit(data.receiver, {msg : data.msg , sender : data.sender});
    console.log("countcheck");
  });

  socket.on("Online", function(data){
    const userName = data.sender+"online";
    socket.broadcast.emit(userName, data.receiver);
  });

  socket.on("typing", function(data) {
    
    const userName = data.sender+"typing";
    socket.broadcast.emit(userName , data.receiver);
  });
});

// Start the server

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;