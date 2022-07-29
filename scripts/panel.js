function onSelectionChanged() {
  chrome.devtools.inspectedWindow.eval(
    'elementChanged($0)',
    { useContentScriptContext: true },
  );
}

function colorChanged(property, value) {
  chrome.devtools.inspectedWindow.eval(
    `changeStyle('${property}','${value}')`,
    { useContentScriptContext: true },
  );
}

chrome.devtools.panels.elements.createSidebarPane('Color Changer', panel => {
  panel.setPage('public/panel.html');
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(onSelectionChanged);

const [header] = document.getElementsByTagName('header');
const [background, foreground] = document.getElementsByTagName('input');

background.addEventListener('change', () => { colorChanged('backgroundColor', background.value); });
foreground.addEventListener('change', () => { colorChanged('color', foreground.value); });

const events = {
  elementChanged({ identifier, color }) {
    header.textContent = `${identifier.key}: ${identifier.value}`;
    background.value = color.background;
    foreground.value = color.foreground;
  },
};

chrome.runtime.onMessage.addListener(({ event, data }, sender, sendResponse) => {
  sendResponse();
  events[event] && events[event](data);
});

chrome.scripting.executeScript({
  target: { tabId: chrome.devtools.inspectedWindow.tabId },
  files: ['scripts/injections/test.js'],
}, onSelectionChanged);
