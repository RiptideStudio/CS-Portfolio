// Function to toggle the sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("mySidebar");
    sidebar.style.width = sidebar.style.width === '400px' ? '0' : '400px';
    sidebar.style.opacity = sidebar.style.opacity === '1' ? '0' : '1';
}
  
// Close the sidebar if the clicked target is outside
document.addEventListener('click', function(event) {
var sidebar = document.getElementById("mySidebar");
var hamburger = document.querySelector(".hamburger-menu");

if (!sidebar.contains(event.target) && !hamburger.contains(event.target) && sidebar.style.width === '400px') {
    sidebar.style.width = '0';
    sidebar.style.opacity = '0';
}
});

// Prevent sidebar from closing when clicking inside
sidebar.addEventListener('click', function(event) {
event.stopPropagation();
});
