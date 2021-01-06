# Dazn Chat Extension (chrome)

### Banter amongst other fans watching the same match!

## Description

This project was an idea for me to test how the WebSocket protocol works and to make an interesting app with the technology.
I couldn't think of any other ideas that were interesting or somewhat unique, so I decided to create an integrated social feature
for the sports streaming service (DAZN). This chat extension allows every user watching the same event on DAZN in the chrome browser to interact
with eachother! The extension detects when you have switched to another event stream, and switches to the chat room of the new event.

## Any Help or suggestions for improvements are always welcome!

### Installation:

TBF

# Project Features Roadmap

## 1.0

### U.X / U.I

1. the chat should have the same height as the DAZN video window
2. The chat should be possible to hide and expand with a clearly designed button.
3. The Name and chat message should have different colours
4. ascii faces (e.g: ‘:)’ ) should automatically mark-up to emojis when posted in messages (same as fb version)
5. Chat should be intuitively scrollable

### Extension detects when client switches events and switches to the chat room of the new event.

### handles video expanding to full-screen

- Executes when the video full-screen state is changed
  - Could be triggered by an event handler on the full screen button
- When full-screen state => true: Hide chat UI
- When full-screen state => false: open chat UI

# Future Improvements:

- Toggle chat interface visibility with a button
- chat can be enabled when video is in full -creen state

### UI

1. option to send GIF and attach picture
2. Extension should only function when user is watching a live event
3. OPTIONAL: un-send / send / delete a message
4. OPTIONAL: ability to mention a person’s name with @ + name
5. Make it is possible make reaction to another person’s message
