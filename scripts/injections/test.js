function elementChanged(element) {
  const identifier = {};

  if (element.hasAttribute('id')) {
    identifier.key = 'id';
    identifier.value = element.id;
  } else if (element.hasAttribute('class')) {
    identifier.key = 'class';
    identifier.value = element.className;
  } else {
    identifier.key = 'tag';
    identifier.value = element.tagName;
  }
  chrome.runtime.sendMessage({
    event: 'elementChanged',
    data: { identifier },
  });
}
