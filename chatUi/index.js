window.onload = () => {
  let username = localStorage.user;
  if (!username && typeof username !== "string") {
    username = prompt("Whats your name?");
    localStorage.user = username;
  }
  // get the eventId
  // send a message to background.js asking for the eventId.
  // send it to the server in the "join" event.
  const getEventId = () =>
    new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "eventId" }, (id) => {
        console.log("eventId in callback:", id);
        resolve(id);
      });
    });
  const joinEvent = async () => {
    eventId = await getEventId();
    socket.emit("join", { username, eventId });
  };
  // create & handle WebSocket
  const socket = io("https://dazn-chat-api.herokuapp.com/");

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
  joinEvent();
};
