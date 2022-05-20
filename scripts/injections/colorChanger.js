export default (identifier) => {
  const targets = [...document.getElementsByClassName(identifier.className)]
  || [document.getElementById(identifier.id)];
  
  const wrapper = document.createElement('div');
  wrapper.id = 'color-changer-wrapper';
  const header = document.createElement('div');
  header.textContent = 'Color Changer';
  header.className = 'color-changer-header';
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'color-changer-content-wrapper';
  const background = document.createElement('input');
  background.type = 'color';
  background.value = targets[0].style.backgroundColor;
  background.addEventListener('change', () => {
    targets.forEach(target => {
      target.style.backgroundColor = background.value;
    });
  })
  contentWrapper.append(background);
  wrapper.append(header, contentWrapper);

  let startX;
  let startY;

  function mousemove(event) {
    let top = wrapper.offsetTop + event.clientY - startY;
    let left = wrapper.offsetLeft + event.clientX - startX;
    startX = event.clientX;
    startY = event.clientY;

    if (top + wrapper.offsetHeight - window.scrollY > window.innerHeight) {
      top = window.scrollY + window.innerHeight - wrapper.offsetHeight;
    } else if (top < window.scrollY) {
      top = window.scrollY;
    }

    if (left < 0) {
      left = 0;
    } else if (left > window.innerWidth - wrapper.offsetWidth) {
      left = window.innerWidth - wrapper.offsetWidth;
    }
    wrapper.style.top = `${top}px`;
    wrapper.style.left = `${left}px`;
  }

  function mouseup() {
    window.removeEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }

  function mousedown(event) {
    startX = event.clientX;
    startY = event.clientY;
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }

  header.addEventListener('mousedown', mousedown);
  document.body.appendChild(wrapper);
  wrapper.style.top = `${window.scrollY + window.innerHeight / 2 - wrapper.offsetHeight / 2}px`;
  wrapper.style.left = `${window.innerWidth / 2 - wrapper.offsetWidth / 2}px`;
}