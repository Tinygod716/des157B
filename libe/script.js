function modifyHeaderAndControlScroll() {
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        const OpenText = document.querySelector('.opening p');
        OpenText.classList.add('fade-out');
    }, 3000);

    setTimeout(() => {
        // Change header background color
        const Header = document.querySelector('header');
        const Video = document.createElement('video');
        const ScrollText = document.querySelector('footer p');
        const ScrollBox = document.querySelector('.scrollanimate');

        Video.src = 'media/opening.mp4';
        Video.autoplay = true;
        Video.muted = true;
        Video.loop = true;
        Video.playsInline = true;
        Video.style.width = '100%';
        Video.style.height = '100%';
        Video.style.objectFit = 'cover';
        Header.appendChild(Video);

        // Allow scrolling again
        document.body.style.overflow = '';
        ScrollText.style.display = 'block';
        ScrollBox.style.display = 'block';
    }, 4000); 
}

modifyHeaderAndControlScroll();

