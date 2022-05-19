import elementSelector from "./injections/elementSelector.js";

const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const url = new URL(tab.url);
document.getElementById('website').textContent = url.host;
const chooseElement = document.getElementById('choose-element');
const cancel = document.getElementById('cancel');

function toggleHiddenVisible(...elements) {
  elements.forEach(element => {
    element.classList.toggle('hidden');
    element.classList.toggle('visible');
  })
}

chooseElement.addEventListener('click', () => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: elementSelector,
  });
  window.close();
});

cancel.addEventListener('click', async () => {
  await chrome.tabs.sendMessage(tab.id, 'cleanup')
  toggleHiddenVisible(cancel, chooseElement);
});

(async function () {
  const [results] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.getElementById('color-changer-highlight-div') ? true : false,
  })
  toggleHiddenVisible(results && results.result ? cancel : chooseElement);
})();