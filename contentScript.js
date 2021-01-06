// check if chat has been previously enabled
// inject the inline style element
const chatStyle = document.createElement("style");

// script to reposition video player:
injectChat();

function injectChat() {
  document.querySelector(
    ".main__main-page-layout--yEFl9>div"
  ).children[0].style.cssText = `position: relative; right: 160px`;

  const script = document.createElement("script");
  const code = `
      const vidDiv = document.querySelector(".main__main-page-layout--yEFl9>div>div");
      vidDiv.style.right = '160px';
  `;
  document.head.appendChild(script);

  // inject The chat-UI as an iframe into the page.

  const chatUI = document.createElement("iframe", {});
  chatUI.id = "dazn-chat-frame";
  chatUI.setAttribute("frameborder", 0);
  chatUI.style.cssText = `borderRadius: 5px; width: 20vw; height: 60vh; position: absolute; top: 0; right: 0;`;
  const vidContainer = document.querySelector(".main__main-page-layout--yEFl9>div");
  vidContainer.appendChild(chatUI);
  // make source the index.html
  chatUI.src = chrome.runtime.getURL("chatUi/index.html");
}

function teardownChat() {
  console.log("teardown the chatUI here");
  // const chatFrame = document.querySelector("#dazn-chat-frame");
  // chatFrame.remove();
  chatUI.remove();
  console.log(chatFrame);
  const vidDiv = document.querySelector(".main__main-page-layout--yEFl9>div>div");
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
});
