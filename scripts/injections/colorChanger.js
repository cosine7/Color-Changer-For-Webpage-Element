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
    // const offsetX = event.clientX - startX;
    // const offsetY = event.clientY - startY;
    // startX = event.clientX;
    // startY = event.clientY;
    // wrapper.style.top = `${wrapper.offsetTop + offsetY}px`;
    // wrapper.style.left = `${wrapper.offsetLeft + offsetX}px`;
    wrapper.style.top = `${wrapper.offsetTop + event.clientY - startY}px`;
    wrapper.style.left = `${wrapper.offsetLeft + event.clientX - startX}px`;
    startX = event.clientX;
    startY = event.clientY;
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