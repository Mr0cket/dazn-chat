// inject the inline style header
const chatStyle = document.createElement("style");

chatStyle.innerHTML = `.video-content__video-content-container--376eu {
  right: 150px;
}`;

document.head.appendChild();

// inject The chat UI into the page.
const chatUI = document.createElement("div");
chatUI.style.cssText = `background: white; borderRadius: 5px; width: 20vw; height: 75vh; position: absolute; top: 0; right: 0;`;
const vidContainer = document.querySelector(".main__main-page-layout--yEFl9>div");
vidContainer.appendChild(chatUI);
const vidDiv = (document.querySelector(
  ".main__main-page-layout--yEFl9>div"
).children[0].style.cssText = `position: relative; right: 160px`);
chatUI.innerHTML = `
  <div id='message-area' style='height: 90%;'>
    <ul id="messageList" style='list-style-type: none;margin: 0;padding: 0; color: black; font-size: 14px; height:-webkit-fill-available' ></ul>
  </div>
  <form id="m"
    style="padding: 3px;position: absolute;bottom: 0;width: 100%; margin-bottom: 2.5%;"
  >
    <input id='msg-input'
      style="border: 0;padding: 10px;width: 84%;margin-right: 0.5%;" 
      placeholder='what was Wenger thinking?' autocomplete'off' type='text'/>
      <button 
      style="
      width: 14%;
      background:rgb(130, 224, 255);
      border: none;
      border-radius: 5px;
      padding: 10px;" >
      send</button>
  </form>
`;

const msgList = document.querySelector("#messageList");

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
