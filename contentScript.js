// inject the inline style element
const chatStyle = document.createElement("style");

chatStyle.innerHTML = `.video-content__video-content-container--376eu {
  right: 150px;
}`;

// script to reposition video player:

const vidDiv = (document.querySelector(
  ".main__main-page-layout--yEFl9>div"
).children[0].style.cssText = `position: relative; right: 160px`);

const script = document.createElement("script");
const code = `
const vidDiv = document.querySelector(".main__main-page-layout--yEFl9>div").children[0];
vidDiv.style.cssText = 'position: relative; right: 160px';
`;
script.text = code;
document.head.appendChild(script);

// inject The chat-UI as an iframe into the page.

const chatUI = document.createElement("iframe");
chatUI.setAttribute("frameborder", 0);
chatUI.style.cssText = `borderRadius: 5px; width: 20vw; height: 75vh; position: absolute; top: 0; right: 0;`;
const vidContainer = document.querySelector(".main__main-page-layout--yEFl9>div");
vidContainer.appendChild(chatUI);

chatUI.setAttribute("src", "localhost:3000");

/* const msgList = document.querySelector("#messageList");

function addMsg(msg, parent) {
  const newMsg = document.createElement("li");
  newMsg.innerText = msg;
  parent.append(newMsg);
}

document.querySelector("#m").onsubmit = (event) => {
  event.preventDefault();
  const message = event.target[0].value;
  addMsg(message, msgList);
  event.target[0].value = "";
};
 */
