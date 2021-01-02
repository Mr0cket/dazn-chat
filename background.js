// call runtime.onInstalled

chrome.runtime.onInstalled.addListener(() => {
  console.log("this always runs once when the extension is installed.");
});

/*  
  Need to update code when chrome88 is release on main chrome channel.

  Manifest v2 && chromeVerson < 88 => chrome.pageAction 

  MV2 &&chromeVerson > 88, Manifest v3 => chrome.action
*/

chrome.pageAction.onClicked.addListener((tab) => {
  enablePopup(tab, tab.id);
});

function isLiveEventPage(urlString) {
  const { hostname, pathname } = new URL(urlString);
  if (pathname.includes("ArticleId")) return false;
  const home = pathname.match(/\/home\//);
  if (!home) return false;
  console.log("contentId length:", pathname.slice(home.index + home.length).length);
  const eventId = pathname.match(/^.*\/([a-z\-0-9]+)\??.*/)[1];
  if (eventId.length < 20) return false;

  return eventId; // send event Id to the backend to register the event..?
}

/*  enable/disable popup / extension

pageAction  => pageAction.show && pageAction.hide
action      => action.enable() && action.disable

*/

// check the page and then enable popup
function enablePopup(tab, tabId) {
  if (!/.dazn./.test(tab.url)) return chrome.pageAction.hide(tabId);
  chrome.pageAction.show(tabId, () => console.log("extension enabled on tab:", tabId));

  //if live event enable dazn chat toggle
  const event = isLiveEventPage(tab.url);
  if (!event) {
    console.log(`not a live event.
    popup => watch.html`);
    return chrome.pageAction.setPopup({ popup: "popup/wrongPage.html", tabId });
  }
  console.log(`tab ${tabId} - is Live event`);

  chrome.pageAction.setPopup({ popup: "popup/index.html", tabId });
  console.log(`popup => popup.html`);
  // chrome.action.setBadgeText({ tabId, text: "live" });
  // chrome.action.setBadgeBackgroundColor({ tabId, color: "green" });
  chrome.storage.sync.set({ chatEnabled: true }, () => console.log("icon enabled"));
  globalThis.daznChatEnabled = true;
  globalThis.activeTabId = tabId;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab ${tabId} ${tab.status}`);
  if (tab.status !== "complete") return;
  if (globalThis.daznChatEnabled) return console.log("daznChat already Enabled", daznChatEnabled);
  enablePopup(tab, tabId);
});

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("sender:", sender);
  console.log("request", request);
  // console.log("sender.id matches location.host:", sender?.id === location?.host);
  setTimeout(() => sendResponse("good Evening"), 50);
  // sendResponse("good Evening");
});
