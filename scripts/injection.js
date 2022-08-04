/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
{
  function rgbToHex(rgb) {
    if (rgb === 'rgba(0, 0, 0, 0)') {
      return '#ffffff';
    }
    return `#${rgb
      .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
      .slice(1)
      .map(n => parseInt(n, 10)
        .toString(16)
        .padStart(2, '0'))
      .join('')}`;
  }

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
      data: {
        identifier,
        color: {
          background: rgbToHex(window.getComputedStyle(element).getPropertyValue('background-color')),
          foreground: rgbToHex(window.getComputedStyle(element).getPropertyValue('color')),
        },
      },
    });
  }
}
