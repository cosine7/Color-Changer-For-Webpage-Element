chrome.devtools.panels.elements.createSidebarPane('Color Changer', panel => {
  panel && panel.setPage('public/panel.html');
});
