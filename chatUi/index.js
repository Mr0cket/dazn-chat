window.onload = () => {
  let username = localStorage.user;
  if (!username || typeof username !== "string") {
    username = prompt("Create a username");
    localStorage.user = username;
  }
  // get the eventId
  // send a message to background.js asking for the eventId.
  // send it to the server in the "join" event.

  // chat Events
  const joinEvent = async () => {
    eventDetails = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "eventDetails" }, (eventDetails) => {
        console.log("eventDetails:", eventDetails);
        resolve(eventDetails);
      });
    });
    socket.emit("join", { username, ...eventDetails });
  };
  const switchRooms = async () => {
    console.log("client switching rooms");
    newEventDetails = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "eventDetails" }, (eventDetails) => {
        console.log("newEventDetails:", eventDetails);
        resolve(eventDetails);
      });
    });
    socket.emit("switchRooms", newEventDetails);
  };

  // create & handle connection to WebSocket
  const socket = io("https://dazn-chat-api.herokuapp.com/");

  document.querySelector("form").onsubmit = function (e) {
    e.preventDefault(); // prevents page reloading
    message = $("#m").val();
    socket.emit("chat message", message);
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
  console.log("injected iframe script chrome:", chrome);
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("meesage recieved in iframe");
    console.log("request", request);
    if (request.type === "switchRooms") {
      switchRooms();
    }
  });
};
