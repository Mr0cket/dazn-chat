// initialise chat on contentScript load
// const chatStyle = document.createElement("style");
const vidDiv = document.querySelector(".main__main-page-layout--yEFl9>div>div");
const vidContainer = document.querySelector(".main__main-page-layout--yEFl9>div");
const chatUI = document.createElement("iframe");
chatUI.id = "dazn-chat-frame";
chatUI.setAttribute("frameborder", 0);
chatUI.style.cssText = `borderRadius: 5px; width: calc(80vh - 401.77778px); height: calc(100vh - 231px); position: absolute; top: 0; right: 0;`;
// make source the index.html
chatUI.src = chrome.runtime.getURL("chatUi/index.html");
// initial chat injection on script load
injectChat();

function injectChat() {
  // inject The chat-UI as an iframe into the page.
  vidContainer.appendChild(chatUI);
  vidDiv.style.right = `160px`; // <== removed css: position: relative;
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
    // test if this worked... somehow?
    // if it didn't work, do something else
  }
});

// future chatUI toggle implementation using a button next to the video player
/* 
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
} */
