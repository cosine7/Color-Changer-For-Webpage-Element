if (!chrome.devtools.inspectedWindow.tabId) {
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

const tab = await chrome.tabs.get(chrome.devtools.inspectedWindow.tabId);
const url = new URL(tab.url);
const [website, title] = document.getElementsByTagName('p');
const [path, background, foreground] = document.getElementsByTagName('input');
const [reset, save] = document.getElementsByTagName('button');
website.textContent = url.hostname;
let selector = null;
const defaultColorCache = {};

reset.addEventListener('click', () => {
  if (!defaultColorCache[selector]) {
    return;
  }
  // if ()
  defaultColorCache[selector]?.forEach(cssInjection => {
    chrome.scripting.removeCSS(cssInjection);
  });
});

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
    target: { tabId: chrome.devtools.inspectedWindow.tabId },
    css: `${selector}{${property}:${color} !important;}`,
  };
  if (defaultColorCache[selector][property]) {
    chrome.scripting.removeCSS(defaultColorCache[selector][property]);
  }
  defaultColorCache[selector][property] = cssInjection;
  chrome.scripting.insertCSS(cssInjection);
}

background.addEventListener('input', () => { colorChanged('background-color', background.value); });
foreground.addEventListener('input', () => { colorChanged('color', foreground.value); });

const events = {
  elementChanged(data) {
    selector = data.selector;
    title.textContent = `css selector: ${selector}`;
    defaultColorCache[selector] = defaultColorCache[selector] || [];
    background.value = data.color.background;
    foreground.value = data.color.foreground;
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
