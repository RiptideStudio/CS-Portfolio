// Function to toggle the sidebar and overlay
function toggleSidebar() {
    var sidebar = document.getElementById("mySidebar");
    var overlay = document.getElementById("overlay");

    if (sidebar.style.width === '22vw') {
        sidebar.style.width = '0';
        sidebar.style.opacity = '0';
        overlay.classList.remove('active');
    } else {
        sidebar.style.width = '22vw';
        sidebar.style.opacity = '1';
        overlay.classList.add('active');
    }
}

// Close the sidebar and overlay if the clicked target is outside
document.addEventListener('click', function(event) {
    var sidebar = document.getElementById("mySidebar");
    var overlay = document.getElementById("overlay");
    var hamburger = document.querySelector(".hamburger-menu");

    if (!sidebar.contains(event.target) && !hamburger.contains(event.target) && sidebar.style.width === '22vw') {
        sidebar.style.width = '0';
        sidebar.style.opacity = '0';
        overlay.classList.remove('active');
    }
});

// Prevent sidebar from closing when clicking inside
document.getElementById("mySidebar").addEventListener('click', function(event) {
    event.stopPropagation();
});
