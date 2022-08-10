const { tabId } = chrome.devtools.inspectedWindow;

if (!tabId) {
  throw new Error('Stop Script');
}

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

const tab = await chrome.tabs.get(tabId);
const url = new URL(tab.url);
const [website, title] = document.getElementsByTagName('p');
const [path, background, foreground] = document.getElementsByTagName('input');
const [resetBgColor, resetColor, save] = document.getElementsByTagName('button');
website.textContent = url.hostname;
let selector = null;
const defaultColorCache = {};

function removeInjectedCSS(property) {
  if (!selector || !defaultColorCache[selector] || !defaultColorCache[selector][property]) {
    return;
  }
  chrome.scripting.removeCSS(defaultColorCache[selector][property]);
}

resetBgColor.addEventListener('click', () => { removeInjectedCSS('background-color'); });
resetColor.addEventListener('click', () => { removeInjectedCSS('color'); });

save.addEventListener('click', async () => {
  const key = url.hostname;
  let obj = await chrome.storage.local.get(key);
  if (!obj) {
    obj = {};
  }
  if (!obj[key]) {
    obj[key] = {};
  }
  const pathKey = path.value ? path.value : '*';
  if (!obj[key][pathKey]) {
    obj[key][pathKey] = {};
  }
  if (!obj[key][pathKey][selector]) {
    obj[key][pathKey][selector] = {};
  }
  obj[key][pathKey][selector].foreground = foreground.value;
  chrome.storage.local.set(obj);
});

function colorChanged(property, color) {
  if (!selector) {
    return;
  }
  const cssInjection = {
    target: { tabId },
    css: `${selector}{${property}:${color} !important;}`,
  };
  chrome.scripting.insertCSS(cssInjection);
  removeInjectedCSS(property);
  defaultColorCache[selector][property] = cssInjection;
}

background.addEventListener('input', () => { colorChanged('background-color', background.value); });
foreground.addEventListener('input', () => { colorChanged('color', foreground.value); });

const events = {
  elementChanged(data) {
    selector = data.selector;
    title.textContent = `css selector: ${selector}`;
    defaultColorCache[selector] = defaultColorCache[selector] || {};
    background.value = data.color.background;
    foreground.value = data.color.foreground;
  },
};

chrome.runtime.onMessage.addListener(({ event, data }, sender, sendResponse) => {
  if (!sender.tab) {
    return;
  }
  sendResponse(events[event]?.(data));
});

chrome.scripting.executeScript({
  target: { tabId },
  files: ['scripts/injection.js'],
}, onSelectionChanged);
