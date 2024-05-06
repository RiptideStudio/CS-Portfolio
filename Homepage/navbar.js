var prevScrollpos = window.pageYOffset || document.documentElement.scrollTop;

window.onscroll = function() {
  var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
  
  // Check if the current scroll position is at the top of the page.
  if (currentScrollPos === 0) {
    // Show the navbar when at the top of the page
    document.getElementById("navbar").style.top = "25px"; // Adjust as necessary to fit your design
    document.getElementById("navbar").style.opacity = "1";
  } else if (prevScrollpos < currentScrollPos) {
    // Hide the navbar when scrolling down
    document.getElementById("navbar").style.top = "-50px"; // Hide the navbar by sliding up
    document.getElementById("navbar").style.opacity = "0";
  } else {
    // Hide the navbar when scrolling up but not at the top
    document.getElementById("navbar").style.top = "-50px";
    document.getElementById("navbar").style.opacity = "0";
  }
  prevScrollpos = currentScrollPos;
}
