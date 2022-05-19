import showColorChanger from './injections/colorChanger.js';

async function loadColorChanger() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ['styles/colorChanger.css'],
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: showColorChanger,
  });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message === 'loadColorChanger') {
    sendResponse();
    loadColorChanger();
  }
});