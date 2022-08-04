chrome.runtime.onConnect.addListener(port => {
  // function devToolsListener({ event, data }) {
  //   if (!data.tabId) {
  //     return;
  //   }
  //   console.log(event, data);
  //   if (event === 'init') {
  //     connections[data.tabId] = port;
  //     return;
  //   }
  //   events[event] && events[event](data);
  // }
  // port.onMessage.addListener(devToolsListener);

  // port.onDisconnect.addListener(() => {
  //   port.onMessage.removeListener(devToolsListener);

  //   Object.entries(connections).some(([key, value]) => {
  //     const result = value === port;
  //     if (result) {
  //       delete connections[key];
  //     }
  //     return result;
  //   });
  // });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // if (message.event === 'loadColorChanger') {
  //   sendResponse();
  //   loadColorChanger(message.identifier);
  // }
  // if (message.event === 'injectScript') {
  //   sendResponse();
  //   injectScript(message.data);
  // }
  // console.log(message);
  // sendResponse();
  // if (!sender.tab) {
  //   return;
  // }
  // const tabId = sender.tab.id;
  // connections[tabId] && connections[tabId].postMessage(message);
});
