chrome.devtools.panels.elements.createSidebarPane('Color Changer', panel => {
  panel.setPage('public/panel.html');
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
  chrome.devtools.inspectedWindow.eval(
    'elementChanged($0)',
    { useContentScriptContext: true },
  );
});

const [header] = document.getElementsByTagName('header');

const events = {
  elementChanged({ identifier }) {
    header.textContent = `${identifier.key}: ${identifier.value}`;
  },
};

chrome.runtime.onMessage.addListener(({ event, data }, sender, sendResponse) => {
  sendResponse();
  events[event] && events[event](data);
});

chrome.scripting.executeScript({
  target: { tabId: chrome.devtools.inspectedWindow.tabId },
  files: ['scripts/injections/test.js'],
}, () => {
  chrome.devtools.inspectedWindow.eval(
    'elementChanged($0)',
    { useContentScriptContext: true },
  );
});
