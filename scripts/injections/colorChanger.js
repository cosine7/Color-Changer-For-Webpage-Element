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
  console.log(targets[0]);
  console.log(window.getComputedStyle(targets[0]).getPropertyValue('background-color'));
  // background.value = ;
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

    if (top < 0) {
      top = 0;
    } else if (top > window.innerHeight - wrapper.offsetHeight) {
      top = window.innerHeight - wrapper.offsetHeight;
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
  wrapper.style.top = `${window.innerHeight / 2 - wrapper.offsetHeight / 2}px`;
  wrapper.style.left = `${window.innerWidth / 2 - wrapper.offsetWidth / 2}px`;
}