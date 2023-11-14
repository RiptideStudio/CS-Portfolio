document.addEventListener('DOMContentLoaded', (event) => {
  let currentIndex = 1;
  const sections = document.querySelectorAll('.section');
  const totalSections = sections.length;

  // Function to show a section based on index
  function showSection(index) {
    sections.forEach((section, idx) => {
 
      section.classList.remove('section-active', 'section-slide-left', 'section-slide-right');
      if (index === idx) {
        // This section should be visible and active.
        section.classList.add('section-active');
      } else if (idx < index) {
        // This section should slide to the left (it's already been viewed).
        section.classList.add('section-slide-left');
      } else {
        // This section should slide to the right (it has not been viewed yet).
        section.classList.add('section-slide-right');
      }
    });
  }

  // Initially show the first section
  showSection(currentIndex);

  // Add event listeners to buttons
  document.getElementById('left-nav').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      showSection(currentIndex);
    }
  });

  document.getElementById('right-nav').addEventListener('click', () => {
    if (currentIndex < totalSections - 1) {
      currentIndex++;
      showSection(currentIndex);
    }
  });
});
