// js/home.js

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
  
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  });
  

  //Subnav in donations
 function showTab(tab) {
  const tabs = ['donors', 'become'];

  tabs.forEach(t => {
    document.getElementById(`tab-${t}`).classList.remove('border-blue-600', 'text-blue-700', 'font-semibold');
    document.getElementById(`content-${t}`).classList.add('hidden');
  });

  document.getElementById(`tab-${tab}`).classList.add('border-blue-600', 'text-blue-700', 'font-semibold');
  document.getElementById(`content-${tab}`).classList.remove('hidden');
}

// Show the first tab by default
document.addEventListener('DOMContentLoaded', () => showTab('donors'));
 