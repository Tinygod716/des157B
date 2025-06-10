(function () {
  'use strict';

  let counter = 0;
  let interval;
  const number = document.getElementById("number");
  const circle = document.getElementById("progress-circle");
  const title = document.getElementById('colorful-title');
  const img = document.getElementById('diskone');
  const container = document.getElementById('container');
  const Weekday = document.querySelector('.weekday p');

  const images = ['images/disk1.png', 'images/disk2.png', 'images/disk3.png', 'images/disk4.png'];
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  
  let index = 0;
  let startY = 0;
  let hasSwitched = false;
  let currentRotation = 0;

  // 1. Fetch listening frequency from external JSON
  async function fetchListeningFrequency(day) {
    try {
      const response = await fetch('listeningData.json');
      const data = await response.json();
      return data.listening_frequency[day];
    } catch (error) {
      console.error('Failed to fetch JSON:', error);
    }
  }

  // 2. Start the progress bar animation
  function startProgressBar(maxPercent) {
    clearInterval(interval);
    counter = 0;
    number.textContent = '0%';
    circle.style.strokeDashoffset = 440;

    interval = setInterval(() => {
      if (counter >= maxPercent) {
        clearInterval(interval);
        return;
      }
      counter++;
      number.textContent = `${counter}%`;
      const offset = 440 - (440 * counter) / 100;
      circle.style.strokeDashoffset = offset;
    }, 30);
  }

  // 3. Initialize the progress bar for a specific day
  async function initProgressBar(day) {
    try {
      const percent = await fetchListeningFrequency(day.toLowerCase());
      if (percent !== undefined) {
        startProgressBar(percent);
      } else {
        console.error(`No data for ${day}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // 4. Initialize colorful title
  function setupColorfulTitle() {
    const colors = ['#E60E7E', '#8B00E6', '#64E501', '#66334E'];
    const text = title.innerText;
    let newHTML = '';

    for (let i = 0; i < text.length; i++) {
      const color = colors[i % colors.length];
      const char = text[i] === ' ' ? '&nbsp;' : text[i];
      newHTML += `<span style="color: ${color};">${char}</span>`;
    }
    title.innerHTML = newHTML;
  }

  // 5. Handle rotating disk animation
  function rotateFrom(startDeg) {
    img.style.animation = 'none';
    const existing = document.getElementById('dynamic-spin');
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

  // 6. Setup event listeners for image interaction
  function setupImageEvents() {
    img.addEventListener('mousedown', (e) => {
      img.style.animation = 'none';
      startY = e.clientY;
      hasSwitched = false;

      const onMouseMove = (e) => {
        let diffY = e.clientY - startY;
        let rotateDeg = currentRotation + diffY / 3;
        img.style.transform = `rotate(${rotateDeg}deg)`;

        if (!hasSwitched && (diffY > 180 || diffY < -180)) {
          hasSwitched = true;

          img.classList.add('fade-out');

          setTimeout(async () => {
            index = (index + 1) % images.length;
            img.src = images[index];

            img.onload = async () => {
              img.classList.remove('fade-out');
              img.classList.add('fade-in');
              setTimeout(() => {
                img.classList.remove('fade-in');
              }, 500);

              currentRotation = 0; // Reset rotation for the new image
              rotateFrom(currentRotation); // Start spinning from fresh state

              // Fetch corresponding day and start new progress bar
              const day = weekdays[index];
              const percent = await fetchListeningFrequency(day);
              function capitalizeFirstLetter(word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
              }
              if (percent !== undefined) {
                startProgressBar(percent);
              } else {
                console.error(`No data for ${day}`);
              }
              Weekday.textContent = capitalizeFirstLetter(day);
            };
          }, 300);
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
  }

  // Initialization
  initProgressBar('monday'); // Start with Monday's data
  setupColorfulTitle();
  rotateFrom(currentRotation);
  setupImageEvents();

})();
