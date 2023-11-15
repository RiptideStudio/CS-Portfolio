var prevScrollpos = window.pageYOffset || document.documentElement.scrollTop;

window.onscroll = function() {
  var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
  
  // If the current scroll position is greater than the previous scroll position, 
  // the user is scrolling down.
  if (prevScrollpos < currentScrollPos) {
    // Slide up and fade out
    document.getElementById("navbar").style.top = "-50px"; // Adjust if your navbar is taller
    document.getElementById("navbar").style.opacity = "0";
  } else {
    // Slide down and fade in
    document.getElementById("navbar").style.top = "24px"; // Adjust to the desired position
    document.getElementById("navbar").style.opacity = "1";
  }
  prevScrollpos = currentScrollPos;
}

