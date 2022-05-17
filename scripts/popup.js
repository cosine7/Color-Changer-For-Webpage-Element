import colorChanger from "./injections/colorChanger.js";

const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const url = new URL(tab.url);
const chooseElement = document.getElementById('choose-element');
const cancel = document.getElementById('cancel');

function toggleHiddenVisible(...elements) {
  elements.forEach(element => {
    element.classList.toggle('hidden');
    element.classList.toggle('visible');
  })
}

const { result } = (await chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: () => document.getElementById('color-changer-highlight-div') ? true : false,
}))[0];
toggleHiddenVisible(result ? cancel : chooseElement);

document.getElementById('website').textContent = url.host;
// document.getElementById('page').textContent = url.pathname;
const main = document.getElementById('app');

chooseElement.addEventListener('click', () => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: colorChanger,
  });
  window.close();
})

function removeHighlightDiv() {
  const highlight = document.getElementById('color-changer-highlight-div');
  highlight && highlight.remove();
}

cancel.addEventListener('click', () => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: removeHighlightDiv,
  });
  toggleHiddenVisible(cancel, chooseElement);
})