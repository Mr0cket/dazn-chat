globalThis.popup = true;
try {
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
} catch (e) {
  console.log(e);
}

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

const messagePort = (async () => await sendMessage())();
console.log(messagePort);
console.log("test", test);
 */
