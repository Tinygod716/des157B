function modifyHeaderAndControlScroll() {
    // prohibit scroll
    document.body.style.overflow = 'hidden';
  
    // TEXT ANIMATIONT
    setTimeout(() => {
      const openText = document.querySelector('.opening p');
      if (openText) openText.classList.add('fade-out');
    }, 3000);
  
    // video animation and scroll text
    setTimeout(() => {
      const header = document.querySelector('header');
      const scrollText = document.querySelector('footer p');
      const scrollBox = document.querySelector('.scrollanimate');
  
      const video = document.createElement('video');
      video.src = 'media/opening.mp4';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
  
      if (header) header.appendChild(video);
      document.body.style.overflow = 'auto'; 
  
      if (scrollText) scrollText.style.display = 'block';
      if (scrollBox) scrollBox.style.display = 'block';
    }, 4000);
  }
  
  // fullPage.js
  new fullpage('#fullpage', {
    autoScrolling: false,    
    scrollHorizontally: true, 
    scrollBar: true,          
    fitToSection: false,     
  });

  modifyHeaderAndControlScroll();
  
  