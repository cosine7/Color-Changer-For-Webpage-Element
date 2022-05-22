export default () => {
  const highlight = document.createElement('div');
  highlight.id = 'color-changer-highlight-div';
  highlight.style.position = 'absolute';
  highlight.style.backgroundColor = '#409EFF';
  highlight.style.opacity = '0.5';
  highlight.style.zIndex = 9999999;
  highlight.style.pointerEvents = 'none';

  let target;

  function mouseover(event) {
    if (!event.target.id && !event.target.className) {
      return;
    }
    event.stopPropagation();
    target = event.target;
    const rect = event.target.getBoundingClientRect();
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.top = `${rect.top + window.scrollY}px`;
    highlight.style.left = `${rect.left + window.scrollX}px`;
  }

  function keydown(event) {
    if (event.key !== 'Escape') {
      return;
    }
    cleanup();
  }

  function click(event) {
    event.preventDefault();
    chrome.runtime.sendMessage({
      event: 'loadColorChanger',
      identifier: {
        id: target.id,
        className: target.className,
      },
    });
    cleanup();
  }

  function listener(message, sender, sendResponse) {
    if (message !== 'cleanup') {
      return;
    }
    sendResponse();
    cleanup();
  }

  function cleanup() {
    highlight.remove();
    window.removeEventListener('mouseover', mouseover);
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('click', click);
    chrome.runtime.onMessage.removeListener(listener);
  }

  chrome.runtime.onMessage.addListener(listener);
  window.addEventListener('mouseover', mouseover);
  window.addEventListener('keydown', keydown);
  window.addEventListener('click', click);
  document.body.appendChild(highlight);
};
