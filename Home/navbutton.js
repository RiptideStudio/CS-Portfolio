document.addEventListener('DOMContentLoaded', (event) => {
    let currentIndex = 0;
    const sections = document.querySelectorAll('.section');
    const totalSections = sections.length;
  
    // Function to show a section based on index
    function showSection(index) {
      sections.forEach((section, idx) => {
        section.style.display = index === idx ? 'block' : 'none';
      });
    }
  
    // Initially show the first section
    showSection(currentIndex);
  
    // Add event listeners to buttons
    document.getElementById('navLeft').addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        showSection(currentIndex);
      }
    });
  
    document.getElementById('navRight').addEventListener('click', () => {
      if (currentIndex < totalSections - 1) {
        currentIndex++;
        showSection(currentIndex);
      }
    });
  });
  