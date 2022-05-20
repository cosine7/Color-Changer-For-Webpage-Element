import showColorChanger from './injections/colorChanger.js';

async function loadColorChanger(identifier) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  await chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ['styles/colorChanger.css'],
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: showColorChanger,
    args: [identifier],
  });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.event === 'loadColorChanger') {
    sendResponse();
    loadColorChanger(message.identifier);
  }
});