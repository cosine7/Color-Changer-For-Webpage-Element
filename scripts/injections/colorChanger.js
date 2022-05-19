export default (target) => {
  const wrapper = document.createElement('div');
  wrapper.id = 'color-changer-wrapper';
  const header = document.createElement('div');
  header.textContent = 'Color Changer';
  header.className = 'color-changer-header';
  wrapper.append(header);

  let startX;
  let startY;

  function mousemove(event) {
    const offsetX = event.clientX - startX;
    const offsetY = event.clientY - startY;
    startX = event.clientX;
    startY = event.clientY;
    wrapper.style.top = `${wrapper.offsetTop + offsetY}px`;
    wrapper.style.left = `${wrapper.offsetLeft + offsetX}px`;
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
}