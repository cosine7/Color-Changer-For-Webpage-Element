const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const url = new URL(tab.url);
document.getElementById('website').textContent = url.host;
const chooseElement = document.getElementById('choose-element');
const cancel = document.getElementById('cancel');

function toggleHiddenVisible(...elements) {
  elements.forEach(element => {
    element.classList.toggle('hidden');
    element.classList.toggle('visible');
  });
}

cancel.addEventListener('click', async () => {
  await chrome.tabs.sendMessage(tab.id, 'cleanup');
  toggleHiddenVisible(cancel, chooseElement);
});
