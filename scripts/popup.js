const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const url = new URL(tab.url);
const chooseElementBtn = document.getElementById('choose-element');
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
toggleHiddenVisible(result ? cancel : chooseElementBtn);

document.getElementById('website').textContent = url.host;
// document.getElementById('page').textContent = url.pathname;
const main = document.getElementById('app');

function some(event) {
  console.log('clickedddd');
}

function chooseElement() {
  const highlight = document.createElement('div');
  highlight.id = 'color-changer-highlight-div';
  highlight.style.position = 'absolute';
  highlight.style.backgroundColor = '#409EFF'
  highlight.style.opacity = '0.5';
  highlight.style.zIndex = 9999999;
  highlight.style.pointerEvents = 'none';

  window.addEventListener('mouseover', event => {
    event.stopPropagation();
    const rect = event.target.getBoundingClientRect();
    highlight.style.width = rect.width + "px";
    highlight.style.height = rect.height + "px";
    highlight.style.top = `${rect.top + window.scrollY}px`;
    highlight.style.left = `${rect.left + window.scrollX}px`;
  })

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }
    highlight.remove();
  })

  window.addEventListener('click', event => {
    // window.open()
    console.log('clickedddd');
  })

  document.body.appendChild(highlight);
}

chooseElementBtn.addEventListener('click', () => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: chooseElement,
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
  toggleHiddenVisible(cancel, chooseElementBtn);
})