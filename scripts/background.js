chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!sender.tab) {
    return;
  }
  if (message.event === 'getTabId') {
    sendResponse(sender.tab.id);
  }
  if (message.event === 'insertCSS') {
    chrome.scripting.insertCSS({
      target: { tabId: sender.tab.id },
      css: message.data.css,
    });
  }
});
