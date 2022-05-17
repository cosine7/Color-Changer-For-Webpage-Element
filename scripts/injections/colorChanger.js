export default () => {
  const highlight = document.createElement('div');
  highlight.id = 'color-changer-highlight-div';
  highlight.style.position = 'absolute';
  highlight.style.backgroundColor = '#409EFF'
  highlight.style.opacity = '0.5';
  highlight.style.zIndex = 9999999;
  highlight.style.pointerEvents = 'none';

  function mouseover(event) {
    event.stopPropagation();
    const rect = event.target.getBoundingClientRect();
    highlight.style.width = rect.width + "px";
    highlight.style.height = rect.height + "px";
    highlight.style.top = `${rect.top + window.scrollY}px`;
    highlight.style.left = `${rect.left + window.scrollX}px`;
  }

  function keydown(event) {
    if (event.key !== 'Escape') {
      return;
    }
    removeEventsAndHighlight();
  }

  function click(event) {
    console.log('clicked');
    removeEventsAndHighlight();
  }

  function removeEventsAndHighlight() {
    highlight.remove();
    window.removeEventListener('mouseover', mouseover)
    window.removeEventListener('keydown', keydown)
    window.removeEventListener('click', click)
  }

  window.addEventListener('mouseover', mouseover)
  window.addEventListener('keydown', keydown)
  window.addEventListener('click', click)
  document.body.appendChild(highlight);
}