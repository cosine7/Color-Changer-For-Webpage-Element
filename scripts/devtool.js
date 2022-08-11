chrome.devtools.panels.elements.createSidebarPane('Color Changer', panel => {
  if (!panel) {
    return;
  }
  panel.setPage('public/panel.html');
});
