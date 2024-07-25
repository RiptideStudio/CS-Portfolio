window.addEventListener('load', () => {
    const words = document.querySelectorAll('.fade-word');
    let delay = 1000;
  
    words.forEach((word, index) => {
      // Set a timeout for each word, increasing the delay for each subsequent word
      setTimeout(() => {
        word.classList.add('show');
      }, delay);
  
      // Increment the delay for the next word
      delay += 500; // 2000ms = 2 seconds between each word
    });
  });
  