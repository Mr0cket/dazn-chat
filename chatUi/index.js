window.onload = () => {
  let user = localStorage.name;
  if (!user && typeof user !== "string") {
    user = prompt("Whats your name?");
    localStorage.name = user;
  }

  const socket = io("https://dazn-chat-api.herokuapp.com/");
  socket.emit("join", user);
  document.querySelector("form").onsubmit = function (e) {
    e.preventDefault(); // prevents page reloading
    console.log($("#m").val());
    socket.emit("chat message", $("#m").val());
    socket.emit("salutations", "Hello!", { mr: "john" }, Uint8Array.from([1, 2, 3, 4]));
    $("#m").val("");
    return false;
  };
  socket.on("connect", () => {
    console.log("connection established with server");
    console.log("client Id:", socket.id);
  });
  socket.on("chat message", function (msg) {
    $("#messages").append($("<li>").text(msg));
  });
  socket.on("join", function (msg) {
    $("#messages").append($("<li>").text(msg));
  });
};
