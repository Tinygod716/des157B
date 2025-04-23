(function () {
  'use strict';

  let counter = 0;
  let interval;
  const number = document.getElementById("number");
  const circle = document.getElementById("progress-circle");

  function startProgressBar() {
    clearInterval(interval);
    counter = 0;
    number.innerHTML = `0%`;
    circle.style.strokeDashoffset = 440;

    interval = setInterval(() => {
      if (counter === 65) {
        clearInterval(interval);
      } else {
        counter++;
        number.innerHTML = `${counter}%`;
        const offset = 440 - (440 * counter) / 100;
        circle.style.strokeDashoffset = offset;
      }
    }, 30);
  }

  startProgressBar(); // start the progress bar

  // colorful title
  const colors = ['#E60E7E', '#8B00E6', '#64E501', '#66334E'];
  const title = document.getElementById('colorful-title');
  const text = title.innerText;
  let newHTML = '';

  for (let i = 0; i < text.length; i++) {
    const color = colors[i % colors.length];
    const char = text[i] === ' ' ? '&nbsp;' : text[i];
    newHTML += `<span style="color: ${color};">${char}</span>`;
  }
  title.innerHTML = newHTML;

  // rotate+drag+hover stop image
  const img = document.getElementById('diskone');
  const container = document.getElementById('container');
  const images = ['images/disk1.png', 'images/disk2.png', 'images/disk3.png', 'images/disk4.png'];
  let index = 0;
  let startY = 0;
  let rotateDeg = 0;
  let hasSwitched = false;
  let currentRotation = 0;

  function rotateFrom(startDeg) {
    img.style.animation = 'none';
    const existing = document.querySelector('#dynamic-spin');
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = 'dynamic-spin';
    style.innerHTML = `
      @keyframes continue-spin {
        from { transform: rotate(${startDeg}deg); }
        to { transform: rotate(${startDeg + 360}deg); }
      }
    `;
    document.head.appendChild(style);

    img.style.animation = 'continue-spin 40s linear infinite';
  }

  rotateFrom(currentRotation);

  // hover to stop and range to rotate
  img.addEventListener('mouseenter', () => {
    const transform = getComputedStyle(img).transform;
    if (transform !== 'none') {
      const values = transform.split('(')[1].split(')')[0].split(',');
      const a = values[0], b = values[1];
      currentRotation = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }
    img.style.animation = 'none';
    img.style.transform = `rotate(${currentRotation}deg)`;
  });

  img.addEventListener('mouseleave', () => {
    rotateFrom(currentRotation);
  });

  img.addEventListener('mousedown', (e) => {
    img.style.animation = 'none';
    startY = e.clientY;
    hasSwitched = false;

    const onMouseMove = (e) => {
      let diffY = e.clientY - startY;
      rotateDeg = diffY / 3;
      img.style.transform = `rotate(${rotateDeg}deg)`;

      if (!hasSwitched && (rotateDeg > 90 || rotateDeg < -90)) {
        hasSwitched = true;

        img.classList.add('fade-out');

        setTimeout(() => {
          index = (index + 1) % images.length;
          img.src = images[index];

          img.onload = () => {
            img.classList.remove('fade-out');
            img.classList.add('fade-in');
            setTimeout(() => {
              img.classList.remove('fade-in');
            }, 500);

            // restart animation
            startProgressBar();
          };
        }, 500);
      }
    };

    const onMouseUp = () => {
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      currentRotation = 0;
      rotateFrom(currentRotation);
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseup', onMouseUp);
  });

})();
