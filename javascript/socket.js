var socket = io();
var form = document.getElementById("form");
var input = document.getElementById("input");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat-message", input.value);
    console.log("count check");
    input.value = "";
  }

  socket.on("new-message", function (msg) {
    var item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
});
socket.on("newuser", function (msg) {
  console.log("New user connected:", msg);
  var head = document.getElementById("user-alert");
  head.textContent = "New user joined";
  setTimeout(() => {
    head.textContent = "";
  }, 3000);
});

socket.on("userleft", function (msg) {
  var head = document.getElementById("user-alert");
  head.textContent = "a user left";
  setTimeout(() => {
    head.textContent = "";
  }, 3000);
});



