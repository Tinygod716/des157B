
(function () {
    'use strict';
  const fs = document.getElementById('expand');
  fs.addEventListener('click', function(){
    if(!document.fullscreenElement){
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }

    })
    
    const img = document.querySelector('#xxri');
const text = document.querySelector('#xxrp');
const Video = document.querySelector('#myVideo');
const mysection = document.querySelector('#xxrs');
const intervalID = setInterval(checkTime, 1000);

function resetAnimation(el, animationString) {
    el.style.animation = 'none';
    el.style.animation = animationString;
}

let hasFiltered = false;

function checkTime() {
    const t = Video.currentTime;

    if ((t > 5 && t < 12) || (t > 16 && t < 25)) {
        img.className = "showing";
        resetAnimation(img, "slideInFromLeft 2s ease-out forwards");
    } else {
        img.className = "hidden";
        img.style.animation = "none";
    }

    if (t > 6 && t < 12) {
        text.className = "showing";
        text.innerHTML = "let me get some filters on this video";
        resetAnimation(text, "shake 0.3s infinite");
    }
    else if (t > 17 && t < 25) {
        text.className = "showing";
        text.innerHTML = "much better right?";
        resetAnimation(text, "shake 0.3s infinite");
    } else {
        text.className = "hidden";
        text.innerHTML = "";
        text.style.animation = "none";
    }


    if (t > 9 && !hasFiltered) {
        const filters = [
            "sepia(50%) hue-rotate(-20deg) saturate(300%)",
            "grayscale(100%)",
            "contrast(200%) brightness(150%)",
            "blur(5px)"
        ];
        const randomFilter = filters[Math.floor(Math.random() * filters.length)];
        Video.style.filter = randomFilter;
        hasFiltered = true;
    }
}


})();