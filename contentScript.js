// check if chat has been previously enabled
// inject the inline style element
const chatStyle = document.createElement("style");
const chatUI = document.createElement("iframe");
chatUI.id = "dazn-chat-frame";
chatUI.setAttribute("frameborder", 0);
chatUI.style.cssText = `borderRadius: 5px; width: 20vw; height: 60vh; position: absolute; top: 0; right: 0;`;
// make source the index.html
chatUI.src = chrome.runtime.getURL("chatUi/index.html");
// const script = document.createElement("script");
const vidDiv = document.querySelector(".main__main-page-layout--yEFl9>div>div");
const vidContainer = document.querySelector(".main__main-page-layout--yEFl9>div");
const chatBtn = document.createElement("button");
vidContainer.appendChild(chatBtn);
chatBtn.onclick = toggleChat;

let chatOpen = false;

function toggleChat() {
  if (chatOpen) {
    teardownChat();
    chatOpen = false;
  } else {
    injectChat();
    chatOpen = true;
  }
}

// initialise chat on contentScript load
function injectChat() {
  // inject The chat-UI as an iframe into the page.
  vidContainer.appendChild(chatUI);
  vidDiv.style.cssText = `right: 160px`; // <== removed css: position: relative;
}

function teardownChat() {
  chatUI.remove();
  vidDiv.style.right = "0px";
}

// event triggers
window.addEventListener("load", (e) => {
  console.log("load event triggered:", e);
});
window.addEventListener("unload", (event) => {
  const port = chrome.runtime.sendMessage({ type: "unloaded", event });
});

let path = location.pathname;

// message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("request => contentScript:", request);
  console.log("sender:", sender);

  // CheckLocation message
  if (request.type === "checkLocation") {
    console.log(`previous path: ${path}
    current Path: ${location.pathname}
    ${location}`);
    if (path !== location.pathname) {
      // client has moved to a new webpage
      // assume that new webpage is another stream.
      path = location.pathname;
      // send message to iframe script to switch chat rooms.
      const port = chrome.runtime.sendMessage({ type: "switchRooms" });
      sendResponse(true);
    }
    sendResponse(false);
  }
  // closeChat message
  if (request.type === "closeChat") {
    teardownChat();
    // test if it worked... somehow?
  }
  if (request.type === "openChat") {
    injectChat();
  }
});
