document.addEventListener('DOMContentLoaded', function() {
    const sidebarItems = document.querySelectorAll('.sidebar li');
    const sections = document.querySelectorAll('.section');
  
    sidebarItems.forEach(function(item) {
      item.addEventListener('click', function() {
        const sectionId = item.getAttribute('data-section');
        const section = document.querySelector(sectionId);
  
        sections.forEach(function(sec) {
          sec.classList.remove('active');
        });
  
        sidebarItems.forEach(function(sidebarItem) {
          sidebarItem.classList.remove('active');
        });
  
        section.classList.add('active');
        item.classList.add('active');
      });
    });
  });