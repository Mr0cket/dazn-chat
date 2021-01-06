/* function toggleChat(event) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        file: "contentScript.js",
      },
      () => {
        if (chrome.runtime.lastError) return console.log("error:", chrome.runtime.lastError);
        console.log("content-script injected");
      }
    );
  });
}
toggleChat(); */

window.onload = () => {
  let chatOpen = true;
  const closeBtn = document.querySelector("button");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    function toggleChat() {
      if (!chatOpen) {
        chrome.tabs.executeScript(
          tabId,
          {
            file: "contentScript.js",
          },
          () => {
            if (chrome.runtime.lastError) return console.log("error:", chrome.runtime.lastError);
            console.log("content-script injected");
          }
        );
      } else {
        console.log("[popup]: sending closeChat msg");
        const port = chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "closeChat" },
          (recieved) =>
            new Promise((res, rej), () => {
              console.log("[popup]: closeChat req recieved");
              chrome.browserAction.disable(tabs[0].id);
              chrome.browserAction.enable(tabs[0].id, () => console.log("extension reset"));
              chatOpen = false;
              closeBtn.innerText = "open Chat";
              res(recieved);
            })
        );
        console.log("tabId", tabId);
        chrome.tabs.reload(tabId, {}, () => {
          console.log("tab reloaded");
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
