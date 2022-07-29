import showColorChanger from './injections/colorChanger.js';

async function loadColorChanger(identifier) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

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

function injectScript({ tabId, scriptToInject }) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: [scriptToInject],
  });
}

const connections = {};

const events = {
  injectScript,
};

chrome.runtime.onConnect.addListener(port => {
  function devToolsListener({ event, data }) {
    if (!data.tabId) {
      return;
    }
    console.log(event, data);
    if (event === 'init') {
      connections[data.tabId] = port;
      return;
    }
    events[event] && events[event](data);
  }
  port.onMessage.addListener(devToolsListener);

  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(devToolsListener);

    Object.entries(connections).some(([key, value]) => {
      const result = value === port;
      if (result) {
        delete connections[key];
      }
      return result;
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // if (message.event === 'loadColorChanger') {
  //   sendResponse();
  //   loadColorChanger(message.identifier);
  // }
  // if (message.event === 'injectScript') {
  //   sendResponse();
  //   injectScript(message.data);
  // }
  console.log(message);
  sendResponse();
  if (!sender.tab) {
    return;
  }
  const tabId = sender.tab.id;
  connections[tabId] && connections[tabId].postMessage(message);
});
