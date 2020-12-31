globalThis.popup = true;
chrome.tabs.executeScript(
  globalThis.activeTabId,
  {
    file: "content-script.js",
  },
  () => console.log("content-script injected")
);

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
