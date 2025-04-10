
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

    const button = document.getElementById("button");
    const FontFamily = document.querySelector("h1");
    const NavBar = document.querySelectorAll(".dropdown a");
    const Dropdown = document.querySelectorAll(".dropdown-content");
    let ischanged = false;
    button.addEventListener('click', function(){
      if (!ischanged){
      document.body.style.backgroundImage = "url('images/background2.png')";
      FontFamily.style.fontFamily =  "'Honk', system-ui";
      NavBar.forEach(link => {
        link.style.color = "white";
      });

      Dropdown.forEach(link => {
        link.style.backgroundColor = "black";
        link.style.borderColor = "white";
      });
  
      ischanged = true;
    } else {
      document.body.style.backgroundImage = "url('images/back1.png')";
      FontFamily.style.fontFamily = "'Bungee Tint', sans-serif";
      NavBar.forEach(link => {
      link.style.color = "black";
      });
      Dropdown.forEach(link => {
        link.style.backgroundColor = "white";
        link.style.borderColor = "black";
      });
      ischanged = false;
    }
    });
  });
  
})();