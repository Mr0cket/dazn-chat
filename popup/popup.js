window.onload = () => {
  let chatOpen = true;
  const closeBtn = document.querySelector("button");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    function toggleChat() {
      console.log("chat toggled. chatOpen:", chatOpen);
      if (!chatOpen) {
        const port = chrome.tabs.sendMessage(tabs[0].id, { type: "openChat" }, (recieved) => {
          console.log("[popup]: openChat req recieved");
          chatOpen = true;
          closeBtn.innerText = "close Chat";
          recieved;
        });
      } else {
        console.log("[popup]: sending closeChat msg");
        const port = chrome.tabs.sendMessage(tabs[0].id, { type: "closeChat" }, (recieved) => {
          console.log("[popup]: closeChat req recieved");
          chatOpen = false;
          closeBtn.innerText = "open Chat";
        });
      }
    }

    closeBtn.onclick = toggleChat;
  });
};

////////////////////////////////
//testing extension messaging.//
////////////////////////////////

// new Promise((resolve, reject) => {
/* 
const sendMessage = () =>
  new Promise((resolve, reject) =>
    chrome.runtime.sendMessage({ type: "hello" }, (response) => {
      console.log("response", response);
      test = response;
      resolve(test);
    })
  );

  console.log("test", test);
const messagePort = (async () => await sendMessage())();
console.log(messagePort);
 */
