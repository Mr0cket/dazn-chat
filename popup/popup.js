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
  function closeChat() {
    console.log("[popup]: sending closeChat msg");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const port = chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "closeChat" },
        (recieved) =>
          new Promise((res, rej), () => {
            console.log("[popup]: closeChat req recieved");
            res(recieved);
          })
      );
    });
  }
  const closeBtn = document.querySelector("button");
  console.log(closeBtn);
  closeBtn.onclick = closeChat;
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
