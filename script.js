
(function () {
    'use strict';
    document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('.dropdown ul li a');
    const dropdowns = document.querySelectorAll('.dropdown-content');
  
    navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.dataset.target;
    

        if (targetId) {
          e.preventDefault();
    
          const currentlyOpen = document.getElementById(targetId);
          const isVisible = currentlyOpen && currentlyOpen.style.display === 'block';
    
          dropdowns.forEach(menu => {
            menu.style.display = 'none';
          });
    
          if (!isVisible && currentlyOpen) {
            currentlyOpen.style.display = 'block';
          }
        }
      });
    });
  
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