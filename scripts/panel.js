function onSelectionChanged() {
  chrome.devtools.inspectedWindow.eval(
    'elementChanged($0)',
    { useContentScriptContext: true },
  );
}

chrome.devtools.panels.elements.createSidebarPane('Color Changer', panel => {
  panel.setPage('public/panel.html');
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(onSelectionChanged);

const [header] = document.getElementsByTagName('header');
const [background, foreground] = document.getElementsByTagName('input');
let identifier = null;

function colorChanged(property, element) {
  // chrome.devtools.inspectedWindow.eval(
  //   `changeStyle('${property}','${element.value}')`,
  //   { useContentScriptContext: true },
  // );
  if (!identifier) {
    return;
  }
  let selector;

  if (identifier.key === 'class') {
    selector = '.';
  } else {
    selector = '#';
  }
  chrome.scripting.insertCSS({
    target: { tabId: chrome.devtools.inspectedWindow.tabId },
    // files: ['styles/colorChanger.css'],
    css: `${selector}${identifier.value}{${property}:${element.value};}`,
  });
}

background.addEventListener('change', () => { colorChanged('background-color', background); });
foreground.addEventListener('change', () => { colorChanged('color', foreground); });

const events = {
  elementChanged(data) {
    identifier = data.identifier;
    header.textContent = `${identifier.key}: ${identifier.value}`;
    background.value = data.color.background;
    foreground.value = data.color.foreground;
  },
};

chrome.runtime.onMessage.addListener(({ event, data }, sender, sendResponse) => {
  sendResponse();
  events[event]?.(data);
});

chrome.scripting.executeScript({
  target: { tabId: chrome.devtools.inspectedWindow.tabId },
  files: ['scripts/injections/test.js'],
}, onSelectionChanged);
