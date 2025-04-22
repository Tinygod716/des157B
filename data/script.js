(function () {
    'use strict';
    let counter = 0;
    const number = document.getElementById("number");
    const circle = document.getElementById("progress-circle");

let interval = setInterval(() => {
  if (counter == 65) {
    clearInterval(interval);
  } else {
    counter++;
    number.innerHTML = `${counter}%`;

    const offset = 440 - (440 * counter) / 100;
    circle.style.strokeDashoffset = offset;
  }
}, 30);

//different color for h1

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
})();