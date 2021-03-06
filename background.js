// call runtime.onInstalled

chrome.runtime.onInstalled.addListener(() => {
  console.log("this always runs once when the extension is installed.");
});

/*  
  Need to update code when chrome88 is release on main chrome channel.

  Manifest v2 && chromeVerson < 88 => chrome.browserAction 

  (Manifest V2 | Manifest v3) && chromeVerson > 88 => chrome.action
*/

chrome.browserAction.onClicked.addListener((tab) => {
  console.log("icon was clicked");
  globalThis.popupEnabled = false;
  enableExtension(tab, tab.id);
});

const checkLocationChange = () => {
  // could make a promise later if necessary
  console.log("sending check location message");
  if (globalThis.popupEnabled)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const port = chrome.tabs.sendMessage(tabs[0].id, { type: "checkLocation" }, (reload) => {
        if (reload) {
          // if true, io client should connect to the new room and disconnect from the old room
          // reload the extension to be able to inject the content script again.
          // console.log(`disable exentension on tab ${tabs[0].id}`);
          // chrome.browserAction.disable(tabs[0].id);
          globalThis.popupEnabled = false;
        }
      });
      console.log("port:", port);
    });
  globalThis.locationTested = true;
  setTimeout(() => (globalThis.locationTested = false), 8000); // check for the path change once every 8 seconds (bad to use global variables for this, but ohwell)
};

function toggleChat(tabId) {
  console.log("adding chat.");
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
}

function isLiveEventPage(urlString) {
  const { hostname, pathname } = new URL(urlString);
  if (pathname.includes("ArticleId")) return false;
  const home = pathname.match(/\/home\//);
  if (!home) return false;
  const eventId = pathname.match(/^.*\/([a-z\-0-9]+)\??.*/)[1];
  console.log("eventId length:", eventId.length);
  return eventId && eventId.length > 20;
}

/*  enable/disable popup / extension

browserAction  => browserAction.enable && browserAction.disable
action      => action.enable() && action.disable

*/

// check the page and then enable popup
function enableExtension(tab, tabId) {
  //if live event enable dazn chat toggle
  if (!isLiveEventPage(tab.url)) {
    console.log(`not a live event.
    popup => watch.html`);
    return chrome.browserAction.setPopup({ popup: "popup/wrongPage.html", tabId });
  }
  console.log(`tab ${tabId} - is Live event`);
  chrome.browserAction.setPopup({ popup: "popup/index.html", tabId });
  console.log(`popup => popup.html`);
  toggleChat(tabId);
  // chrome.storage.sync.set({ chatEnabled: true }, () => console.log("icon enabled"));
  globalThis.popupEnabled = true;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(globalThis.locationTested);
  if (!/.dazn./.test(tab.url)) return chrome.browserAction.disable(tabId);
  else chrome.browserAction.enable(tabId, () => console.log("extension enabled on tab:", tabId));
  if (!globalThis.locationTested) checkLocationChange();
  console.log(`Tab ${tabId} ${tab.status}`);
  if (tab.status !== "complete") return;

  if (isLiveEventPage) {
    chrome.browserAction.setBadgeText({ tabId, text: "live" });
    chrome.browserAction.setBadgeBackgroundColor({ tabId, color: "green" });
  } else {
    chrome.browserAction.setBadgeText({ tabId, text: "" });
    chrome.browserAction.setBadgeBackgroundColor({ tabId, color: "" });
  }
  // if (globalThis.popupEnabled)
  //   return console.log("daznChat already Enabled", globalThis.popupEnabled);
  // enablePopup(tab, tabId);
});

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("sender:", sender);
  console.log("request", request);
  // console.log("sender.id matches location.host:", sender?.id === location?.host);
  const { type, event } = request;
  // check types
  if (type === "eventDetails") {
    const eventId = sender.tab.url.match(/^.*\/([a-z\-0-9]+)\??.*/)[1];
    const title = sender.tab.title;
    console.log(title);
    sendResponse({ eventId, title });
  }
  if (type === "unloaded") {
    console.log("window was unloaded");
    console.log("event", event);
  }
  // sendResponse("good Evening");
});
