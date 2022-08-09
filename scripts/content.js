const host = window.location.hostname;
const path = window.location.pathname;

chrome.storage.local.get(host, item => {
  if (!item || !item[host]) {
    return;
  }
  console.log(item);
  Object.entries(item[host]).forEach(([pathKey, selectors]) => {
    if (pathKey === '*' || path.startsWith(pathKey)) {
      Object.entries(selectors).forEach(([selector, colors]) => {
        chrome.runtime.sendMessage({
          event: 'insertCSS',
          data: {
            css: `${selector}{color:${colors.foreground} !important;}`,
          },
        });
      });
    }
  });
});
