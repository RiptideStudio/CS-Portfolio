document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('video');
    const playPauseButton = document.getElementById('playPause');
    const seekbar = document.getElementById('seekbar');
    const muteToggleButton = document.getElementById('muteToggle');
    const fullScreenButton = document.getElementById('fullScreen');

    playPauseButton.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playPauseButton.textContent = 'Pause';
        } else {
            video.pause();
            playPauseButton.textContent = 'Play';
        }
    });

    video.addEventListener('timeupdate', function() {
        seekbar.value = (video.currentTime / video.duration) * 100;
    });

    seekbar.addEventListener('input', function() {
        video.currentTime = (seekbar.value * video.duration) / 100;
    });

    video.addEventListener('loadedmetadata', function() {
        seekbar.value = (video.currentTime / video.duration) * 100;
    });

    muteToggleButton.addEventListener('click', function() {
        if (video.muted) {
            video.muted = false;
            muteToggleButton.textContent = 'Mute';
        } else {
            video.muted = true;
            muteToggleButton.textContent = 'Unmute';
        }
    });

    fullScreenButton.addEventListener('click', function() {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { /* Firefox */
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { /* IE/Edge */
            video.msRequestFullscreen();
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const videoPlayer = document.querySelector('.custom-video-player');
    const video = document.getElementById('video');
    const controls = videoPlayer.querySelector('.controls');
    const topBar = videoPlayer.querySelector('.top-bar');
    const closeButton = document.querySelector('.close-btn');

    let timeout;
    let mouseTimer = null, cursorVisible = true;

    function disappearCursor() {
        if (video.paused) return;
        if (cursorVisible) {
            videoPlayer.style.cursor = 'none';  // Hide the cursor
            hideControls();
            cursorVisible = false;
        }
    }

    function showControls() {
        controls.style.opacity = '1';
        topBar.style.opacity = '1';
        resetTimer();
    }

    function hideControls() {
        if (video.paused) return;
        controls.style.opacity = '0';
        topBar.style.opacity = '0';
    }

    function resetTimer() {
        clearTimeout(timeout);
        clearTimeout(mouseTimer);

        timeout = setTimeout(hideControls, 1500);  // Hide after 3 seconds of inactivity
        if (!cursorVisible) {
            videoPlayer.style.cursor = 'default'; // Show the cursor
            if (!video.paused) {                 // Show controls only if video is playing
                controls.style.opacity = '1';
                topBar.style.opacity = '1';
            }
            cursorVisible = true;
        }
        mouseTimer = setTimeout(disappearCursor, 1500); // Set timeout to hide cursor
    }

    videoPlayer.addEventListener('mousemove', showControls);
    videoPlayer.addEventListener('mouseleave', hideControls);
    video.addEventListener('play', resetTimer);
    video.addEventListener('pause', showControls);

    closeButton.addEventListener('click', function() {
        videoPlayer.style.opacity = '0';
        videoPlayer.style.transform = 'scale(0)';
        video.pause();
    });

    resetTimer();  // Start the timer initially
});

document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('video');
    const videoPlayer = document.querySelector('.custom-video-player');
    const overlay = videoPlayer.querySelector('.video-overlay');
    const controls = videoPlayer.querySelector('.controls');
    const topBar = videoPlayer.querySelector('.top-bar');

    video.addEventListener('click', function() {
        togglePlayPause();
    });

    function togglePlayPause() {
        if (video.paused) {
            video.play();
            overlay.innerHTML = '&#10074;&#10074;';  // Unicode for pause symbol
        } else {
            video.pause();
            overlay.innerHTML = '&#9658;';  // Unicode for play symbol
        }
    }

    video.addEventListener('play', function() {
        overlay.innerHTML = '&#10074;&#10074;';
        overlay.style.opacity = 0;
    });

    video.addEventListener('pause', function() {
        overlay.innerHTML = '&#9658;';
        overlay.style.opacity = 1;
    });

    // Hide controls and overlay when the video ends
    video.addEventListener('ended', function() {
        overlay.style.opacity = 0;
        controls.style.opacity = 0;
        topBar.style.opacity = 0;
        hamburger.style.opacity = 0;
    });
});

