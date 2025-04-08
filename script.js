
(function () {
    'use strict';
    document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('.dropdown ul li a');
    const dropdowns = document.querySelectorAll('.dropdown-content');
  
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
  
        const targetId = this.dataset.target;
  
        // 如果当前点击的已经是展开的，就关闭它
        const currentlyOpen = document.getElementById(targetId);
        const isVisible = currentlyOpen && currentlyOpen.style.display === 'block';
  
        // 关闭所有 dropdown
        dropdowns.forEach(menu => {
          menu.style.display = 'none';
        });
  
        // 重新打开当前目标（如果之前是关闭的）
        if (!isVisible && currentlyOpen) {
          currentlyOpen.style.display = 'block';
        }
      });
    });
  
    // 点击空白区域时关闭所有 dropdown
    window.addEventListener('click', function (e) {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(menu => {
          menu.style.display = 'none';
        });
      }
    });
  });
  
})();