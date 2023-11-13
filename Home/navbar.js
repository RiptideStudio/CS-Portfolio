var prevScrollpos = window.scrollY || document.documentElement.scrollTop;

window.onscroll = function() {
  var currentScrollPos = window.scrollY || document.documentElement.scrollTop;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "16px";
  } else {
    document.getElementById("navbar").style.top = "-50px"; // Adjust this value to the navbar's height
  }
  prevScrollpos = currentScrollPos;
}
