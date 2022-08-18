{
  const host = window.location.hostname;
  const path = window.location.pathname;

  chrome.storage.local.get(host, item => {
    if (!item || !item[host]) {
      return;
    }
    chrome.runtime.sendMessage({
      event: 'insertCSS',
      data: {
        paths: item[host],
        currentPath: path,
      },
    });
  });
}
