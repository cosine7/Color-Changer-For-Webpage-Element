export default identifier => {
  const targets = [...document.getElementsByClassName(identifier.className)]
    .filter(element => element.className === identifier.className)
  || [document.getElementById(identifier.id)];

  function rgbaToHex(rgba) {
    return `#${rgba
      .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
      .slice(1)
      .map((num, index) => (index === 3 ? Math.round(parseFloat(num) * 255) : parseFloat(num))
        .toString(16)
        .padStart(2, '0')
        .replace('NaN', ''))
      .join('')}`;
  }

  const background = document.createElement('input');
  background.type = 'color';
  background.value = rgbaToHex(window.getComputedStyle(targets[0]).getPropertyValue('background-color'));
  background.addEventListener('change', () => {
    targets.forEach(target => {
      target.style.backgroundColor = background.value;
    });
  });
  const foreground = document.createElement('input');
  foreground.type = 'color';
  foreground.value = rgbaToHex(window.getComputedStyle(targets[0]).getPropertyValue('color'));
  foreground.addEventListener('change', () => {
    targets.forEach(target => {
      target.style.color = foreground.value;
    });
  });
  const backgroundWrapper = document.createElement('div');
  backgroundWrapper.append('Background: ', background);
  const foregroundWrapper = document.createElement('div');
  foregroundWrapper.append('Foreground: ', foreground);
  const save = document.createElement('button');
  save.textContent = 'Save';
  save.className = '';
  const reset = document.createElement('button');
  reset.textContent = 'Reset';
  reset.className = '';
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'color-changer-content-wrapper';
  contentWrapper.append(backgroundWrapper, foregroundWrapper, reset, save);
  const wrapper = document.createElement('div');
  wrapper.id = 'color-changer-wrapper';
  const close = document.createElement('span');
  close.innerHTML = '&times;';
  const header = document.createElement('div');
  header.textContent = 'Color Changer';
  header.className = 'color-changer-header';
  header.appendChild(close);
  wrapper.append(header, contentWrapper);

  const position = {};

  function mousemove(event) {
    let top = wrapper.offsetTop + event.clientY - position.y;
    let left = wrapper.offsetLeft + event.clientX - position.x;
    position.x = event.clientX;
    position.y = event.clientY;

    if (top < 0) {
      top = 0;
    } else if (top > document.body.clientHeight - wrapper.offsetHeight) {
      top = document.body.clientHeight - wrapper.offsetHeight;
    }

    if (left < 0) {
      left = 0;
    } else if (left > document.body.clientWidth - wrapper.offsetWidth) {
      left = document.body.clientWidth - wrapper.offsetWidth;
    }

    wrapper.style.top = `${top}px`;
    wrapper.style.left = `${left}px`;
  }

  function mouseup() {
    window.removeEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }

  function mousedown(event) {
    position.x = event.clientX;
    position.y = event.clientY;
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }

  header.addEventListener('mousedown', mousedown);
  document.body.appendChild(wrapper);
  wrapper.style.top = `${window.innerHeight / 2 - wrapper.offsetHeight / 2}px`;
  wrapper.style.left = `${window.innerWidth / 2 - wrapper.offsetWidth / 2}px`;
};
