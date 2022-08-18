const events = {
  insertCSS({ paths, currentPath }, tabId) {
    Object.entries(paths).forEach(([path, selectors]) => {
      if (!currentPath.startsWith(path)) {
        return;
      }
      Object.entries(selectors).forEach(([selector, colors]) => {
        Object.entries(colors).forEach(([property, value]) => {
          chrome.scripting.insertCSS({
            target: { tabId },
            css: `${selector}{${property}:${value} !important;}`,
          });
        });
      });
    });
  },
};

chrome.runtime.onMessage.addListener(({ event, data }, sender, sendResponse) => {
  sender.tab && sendResponse(events[event]?.(data, sender.tab.id));
});
