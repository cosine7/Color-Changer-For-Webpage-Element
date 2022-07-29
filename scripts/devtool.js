chrome.devtools.panels.elements.createSidebarPane('Color Changer', panel => {
  panel.setPage('public/panel.html');

  chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
    chrome.devtools.inspectedWindow.eval(
      'elementChanged($0)',
      { useContentScriptContext: true },
    );
  });
});
