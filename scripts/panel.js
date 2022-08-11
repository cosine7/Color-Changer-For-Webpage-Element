const { tabId } = chrome.devtools.inspectedWindow;

function onSelectionChanged() {
  chrome.devtools.inspectedWindow.eval(
    'elementChanged($0)',
    { useContentScriptContext: true },
  );
}

chrome.devtools.panels.elements.onSelectionChanged.addListener(onSelectionChanged);

const tab = await chrome.tabs.get(tabId);
const { hostname, pathname } = new URL(tab.url);
const [website, title] = document.getElementsByTagName('p');
const [path, background, foreground] = document.getElementsByTagName('input');
const [
  resetBgColor, saveBgColor,
  resetColor, saveColor,
  deleteBgColor, deleteColor,
] = document.getElementsByTagName('button');
const savedBgColor = document.getElementById('saved-bg-color');
const savedColor = document.getElementById('saved-color');
website.textContent = hostname;
let selector = null;
const defaultColorCache = {};
const saved = (await chrome.storage.local.get(hostname)) || {};
saved[hostname] = saved[hostname] || {};

function removeInjectedCSS(property) {
  if (!selector || !defaultColorCache[selector] || !defaultColorCache[selector][property]) {
    return;
  }
  chrome.scripting.removeCSS(defaultColorCache[selector][property]);
}

resetBgColor.addEventListener('click', () => { removeInjectedCSS('background-color'); });
resetColor.addEventListener('click', () => { removeInjectedCSS('color'); });

function save(property, value, span) {
  if (!selector) {
    return;
  }
  const pathKey = path.value ? path.value : '/';
  saved[hostname][pathKey] = saved[hostname][pathKey] || {};
  saved[hostname][pathKey][selector] = saved[hostname][pathKey][selector] || {};
  saved[hostname][pathKey][selector][property] = value;
  chrome.storage.local.set(saved);
  span.textContent = value;
}

saveBgColor.addEventListener('click', () => { save('background-color', background.value, savedBgColor); });
saveColor.addEventListener('click', () => { save('color', foreground.value, savedColor); });

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

function deleteSaved(property, input) {
  if (!selector) {
    return;
  }
  const pathKey = path.value ? path.value : '/';
  if (!saved[hostname][pathKey] || !saved[hostname][pathKey][selector]) {
    return;
  }
  const value = saved[hostname][pathKey][selector][property];
  if (!value) {
    return;
  }
  chrome.scripting.removeCSS({
    target: { tabId },
    css: `${selector}{${property}:${value} !important;}`,
  });
  delete saved[hostname][pathKey][selector][property];
  chrome.storage.local.set(saved);
  input.textContent = 'null';
}

deleteBgColor.addEventListener('click', () => { deleteSaved('background-color', savedBgColor); });
deleteColor.addEventListener('click', () => { deleteSaved('color', savedColor); });

const events = {
  elementChanged(data) {
    selector = data.selector;
    title.textContent = `css selector: ${selector}`;
    defaultColorCache[selector] = defaultColorCache[selector] || {};
    background.value = data.color.background;
    foreground.value = data.color.foreground;

    Object.entries(saved[hostname]).forEach(([pathKey, selectors]) => {
      if (!pathname.startsWith(pathKey)) {
        return;
      }
      const colors = selectors[selector];
      savedBgColor.textContent = colors?.['background-color'] ? colors['background-color'] : 'null';
      savedColor.textContent = colors?.color ? colors.color : 'null';
      path.value = pathKey;
    });
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
