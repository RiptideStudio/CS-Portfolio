function openOverlay() {
  document.getElementById("overlayMenu").style.height = "100%";
  document.getElementById("overlayMenu").style.opacity = "1";
}

// Close the overlay
function closeOverlay() {
  document.getElementById("overlayMenu").style.height = "0%";
  document.getElementById("overlayMenu").style.opacity = "0";
}

function toggleOverlay() {
  var overlay = document.getElementById("overlayMenu");
  var hamburger = document.querySelector('.hamburger-menu');

  // Check if the overlay is currently shown
  if (overlay.style.height === "100%") {
    overlay.style.height = "0%";
    hamburger.style.display = "block"; // Show hamburger icon
  } else {
    overlay.style.height = "100%";
    hamburger.style.display = "none"; // Hide hamburger icon
  }
}
// Event listener for hamburger menu button
document.querySelector('.hamburger-menu').addEventListener('click', toggleOverlay);

// Event listener for close button inside overlay
document.querySelector('.closebtn').addEventListener('click', toggleOverlay);