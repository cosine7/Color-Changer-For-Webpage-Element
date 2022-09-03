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

  function getColor(element, property) {
    return rgbToHex(window.getComputedStyle(element).getPropertyValue(property));
  }

  function elementChanged(element) {
    if (!element.offsetParent) {
      return;
    }
    let selector;
    if (element.className) {
      selector = [element.tagName, ...element.classList].join('.');
    } else if (element.id) {
      selector = `${element.tagName}#${element.id}`;
    } else {
      selector = element.tagName;
      let el = element.parentElement;

      while (el) {
        if (el.className) {
          selector = `${[el.tagName, ...el.classList].join('.')}>${selector}`;
          break;
        }
        if (el.id) {
          selector = `${el.tagName}#${el.id}>${selector}`;
          break;
        }
        selector = `${el.tagName}>${selector}`;
        el = el.parentElement;
      }
    }
    chrome.runtime.sendMessage({
      event: 'elementChanged',
      data: {
        // eslint-disable-next-line no-useless-escape
        selector: selector.replaceAll(/[:\[\]]/g, s => `\\${s}`),
        color: {
          background: getColor(element, 'background-color'),
          foreground: getColor(element, 'color'),
        },
      },
    });
  }
}
