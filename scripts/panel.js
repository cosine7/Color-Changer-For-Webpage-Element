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
const [reset, save] = document.getElementsByTagName('button');

let selector = null;
const defaultColorCache = {};

reset.addEventListener('click', () => {
  defaultColorCache[selector]?.forEach(cssInjection => {
    chrome.scripting.removeCSS(cssInjection);
  });
});

function colorChanged(property, color) {
  if (!selector) {
    return;
  }
  const cssInjection = {
    target: { tabId: chrome.devtools.inspectedWindow.tabId },
    css: `${selector}{${property}:${color} !important;}`,
  };
  defaultColorCache[selector]?.push(cssInjection);
  chrome.scripting.insertCSS(cssInjection);
}

background.addEventListener('change', () => { colorChanged('background-color', background.value); });
foreground.addEventListener('change', () => { colorChanged('color', foreground.value); });

const events = {
  elementChanged(data) {
    selector = data.selector;
    header.textContent = `css selector: ${selector}`;
    if (!defaultColorCache[selector]) {
      defaultColorCache[selector] = [];
    }
    background.value = data.color.background;
    foreground.value = data.color.background;
  },
};

chrome.runtime.onMessage.addListener(({ event, data }, sender, sendResponse) => {
  if (!sender.tab) {
    return;
  }
  sendResponse();
  events[event]?.(data);
});

chrome.scripting.executeScript({
  target: { tabId: chrome.devtools.inspectedWindow.tabId },
  files: ['scripts/injection.js'],
}, onSelectionChanged);
