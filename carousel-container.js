let slideIndexes = {};
var carouselsCreated = 0;
var selectedCarouselId = -1;
const PREVIEW_DELAY_MS = 900; // Linger delay before auto-preview
let previewTimerBySlide = new Map();
// Use a single global flag so other scripts (player) can update it
if (typeof window !== 'undefined' && typeof window.isPlayerOpen === 'undefined') {
    window.isPlayerOpen = false;
}
// Track whether the user has interacted (so we can play quiet audio without being blocked)
if (typeof window !== 'undefined' && typeof window.userInteracted === 'undefined') {
    window.userInteracted = false;
    const markInteracted = () => { window.userInteracted = true; };
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(evt => {
        window.addEventListener(evt, markInteracted, { once: true, passive: true });
    });
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let whooshBuffer;
fetch('Audio/Whoosh.ogg')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
        whooshBuffer = audioBuffer;
    })
    .catch(e => console.error('Error loading audio file:', e));

// Function to play the Whoosh sound at a random pitch
function playWhooshSound() {
    if (whooshBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = whooshBuffer;
        source.playbackRate.value = Math.random() * (1.5 - 0.75) + 0.75;
        source.connect(audioContext.destination);
        source.start();
    }
}

// Function to handle the sliding of the carousel
function moveSlide(step, carouselId) {
    const carousel = document.getElementById(carouselId);
    const slides = carousel.querySelectorAll('.image-container');  // Select container to manage active status

    // Updating slide indexes to manage wrapping correctly
    if (!slideIndexes.hasOwnProperty(carouselId)) {
        slideIndexes[carouselId] = Math.floor(slides.length / 2);
    }

    let newIndex = slideIndexes[carouselId] + step;
    newIndex = ((newIndex % slides.length) + slides.length) % slides.length;
    slideIndexes[carouselId] = newIndex;

    console.log(`New active index: ${slideIndexes[carouselId]}`); // In moveSlide

    updateSlidePosition(carouselId, newIndex);
    updateActiveSlides(carouselId);

    carousel.scrollIntoView({ behavior: 'smooth', block: 'center'});

    deactivateAllSlides(carouselId);
    // cancel previews in other carousels and non-active slides in this one
    const carouselEl = document.getElementById(carouselId);
    document.querySelectorAll('.image-container').forEach(slide => {
        if (!carouselEl.contains(slide) || !slide.classList.contains('active')) {
            clearPreviewForSlide(slide);
        }
    });
    playWhooshSound();
}

// Normalize various YouTube inputs (id, share URL, watch URL) to just the video id
function extractYouTubeId(raw) {
    if (!raw) return '';
    const value = String(raw).trim();
    try {
        // Full watch URL
        if (value.includes('youtube.com')) {
            const url = new URL(value);
            const v = url.searchParams.get('v');
            if (v) return v;
            // sometimes embed form
            const parts = url.pathname.split('/');
            return parts.pop() || '';
        }
        // Short share URL
        if (value.includes('youtu.be/')) {
            const after = value.split('youtu.be/')[1];
            return (after || '').split('?')[0];
        }
        // Raw id with possible extra query (e.g., abc123?si=...)
        return value.split('?')[0];
    } catch {
        return value.split('?')[0];
    }
}

function normalizeVideoPath(raw) {
    if (!raw) return '';
    const v = String(raw).trim();
    if (v.toLowerCase() === 'undefined') return '';
    return v;
}

function hasValidMp4(raw) {
    const v = normalizeVideoPath(raw);
    if (!v) return false;
    const path = v.split('?')[0].toLowerCase();
    return path.endsWith('.mp4');
}

// Function to deactivate all slides in all carousels
function deactivateAllSlides(currentCarouselId) {
    const allCarousels = document.querySelectorAll('.carousel-container');

    // Iterate over each carousel
    allCarousels.forEach(carousel => {
        const carouselId = carousel.id;
        if (carouselId && slideIndexes.hasOwnProperty(carouselId) && carouselId != currentCarouselId) {

            // make all slides faded out in that carousel
            const slides = carousel.querySelectorAll('.image-container');
            slides.forEach((slide, index) => {

                const img = slide.querySelector('.carousel-image');
                const overlay = slide.querySelector('.overlay-image');

                if (img && overlay) {
                    img.classList.remove('active');
                    img.style.opacity = '0.25';
                    img.style.transform = 'scale(1)';
                    overlay.style.transform = 'scale(0)';
                } 
            });
        }
    });
}

function updateSlidePosition(carouselId, newIndex) {

    const carousel = document.getElementById(carouselId);
    const carouselSlideContainer = carousel.querySelector('.carousel-slide');
    const slides = carousel.querySelectorAll('.image-container');
    
    if (slides.length === 0) return;  // Early exit if no slides

    const containerWidth = carousel.clientWidth;
    const imageWidth = slides[0].clientWidth;  // Assumes all slides are the same width
    const totalSlideWidth = slides.length * imageWidth;
    const offset = (containerWidth - imageWidth) / 2;  // Center offset

    // Calculate the position to align the slide's center with the carousel's center
    let newLeft = -slides[newIndex].offsetLeft + offset;
    let leftOffset = (totalSlideWidth/2)-imageWidth*1.75;
    let rightOffset = -leftOffset;

    // clamp our values to the left and right
    if (newLeft > leftOffset)
    {
        newLeft = leftOffset;
    }
    if (newLeft < rightOffset)
    {
        newLeft = rightOffset;
    }

    // Apply the transformation
    carouselSlideContainer.style.transform = `translateX(${newLeft}px)`;
}

function updateActiveSlides(carouselId) {
    const carousel = document.getElementById(carouselId);
    const slides = carousel.querySelectorAll('.image-container');
    const activeIndex = slideIndexes[carouselId];

    // reset properties of the slides
    slides.forEach((slide, index) => {

        const img = slide.querySelector('.carousel-image');
        const overlay = slide.querySelector('.overlay-image');
        slide.classList.remove('active');

        if (img && overlay) {
            img.classList.remove('active');
            img.style.opacity = '0.5';
            img.style.transform = 'scale(1)';
            overlay.style.transform = 'scale(0)';

        } else {
            console.error(`Missing .carousel-image or .overlay-image in slide at index ${index}`);
        }
    });

    // Enhancing far left or right slides' style
    slides.forEach((slide, index) => {
        if (Math.abs(index - activeIndex) > 1) { // Adjust '1' to increase or decrease the range of "far" slides
            const img = slide.querySelector('.carousel-image');

            if (img) {
                img.style.opacity = '0.1'; // Far slides opacity
                img.style.transform = 'scale(1)';
            }
        }
    });

    const activeSlide = slides[slideIndexes[carouselId]];
    if (activeSlide) {
        const activeImg = activeSlide.querySelector('.carousel-image');
        const activeOverlay = activeSlide.querySelector('.overlay-image');
        const heroPreview = document.getElementById('heroPreview');
        const heroPreviewYT = document.getElementById('heroPreviewYT');
        
        if (activeImg && activeOverlay) {
            activeImg.classList.add('active');
            activeImg.style.opacity = '1';
            activeImg.style.transform = 'scale(1)';
            activeOverlay.style.transform = 'scale(0.75)';

            // reset hero preview
            if (heroPreview) {
                heroPreview.pause();
                heroPreview.currentTime = 0;
                heroPreview.classList.remove('is-visible');
            }
            if (heroPreviewYT) {
                heroPreviewYT.src = '';
                heroPreviewYT.classList.remove('is-visible');
            }
        }
    }

    slides.forEach((slide, index) => {
        slides.forEach(s => s.classList.remove('active'));
    });

    // if the active slide is valid, flag it as such
    if (activeSlide)
    {
        activeSlide.classList.add('active');

        // schedule auto-preview on linger
        schedulePreviewForSlide(activeSlide);

        // disable the trailer button if we have no video
        const trailerButton = document.getElementById('playButton');
        const videoPath = activeSlide.dataset.video;
        const youtubeLink = extractYouTubeId(activeSlide.dataset.youtube);

        trailerButton.style.display = 'block';

        if ((!videoPath || videoPath === 'undefined' || String(videoPath).trim() === '') && (!youtubeLink || youtubeLink === 'undefined' || String(youtubeLink).trim() === ''))
        {
            console.log(videoPath);
            trailerButton.style.display = 'none';   
        }

        // Disable the game text container if we have no link
        const gameContainer = document.querySelector('.game-text-container');
        const link = activeSlide.dataset.projectLink;

        if (!link) {
            gameContainer.querySelector('a').style.display = 'none';       // Hide the link
            gameContainer.querySelector('img').style.display = 'none';     // Hide the image
        } else {
            gameContainer.querySelector('a').style.display = 'inline';     // Show the link if it exists
            gameContainer.querySelector('img').style.display = 'inline';   // Show the image if it exists
        }
    }

    updateActiveSlideDisplay(carouselId);
}

function schedulePreviewForSlide(slideEl) {
    clearPreviewForSlide(slideEl);
    if (isPlayerOpen) return; // do not start previews while player is open
    const videoPath = normalizeVideoPath(slideEl?.dataset?.video);
    let youtubeId = extractYouTubeId(slideEl?.dataset?.youtube);
    // Fallback: try to parse ID from projectLink if explicit youtube field is missing/invalid
    if (!youtubeId || youtubeId.length !== 11) {
        youtubeId = extractYouTubeId(slideEl?.dataset?.projectLink);
    }
    const hasProjectLink = !!normalizeVideoPath(slideEl?.dataset?.projectLink);
    const heroPreview = document.getElementById('heroPreview');
    const heroPreviewYT = document.getElementById('heroPreviewYT');
    const mp4Ok = hasValidMp4(videoPath);
    // Rule: If there is no mp4 and no link, do NOT try YouTube; keep the static image
    const canUseYouTube = !!youtubeId && youtubeId.length === 11 && hasProjectLink;
    if ((!mp4Ok && !canUseYouTube) || (!heroPreview && !heroPreviewYT)) return;

    const startTimer = setTimeout(() => {
        // start preview
        try {
            if (mp4Ok && heroPreview) {
                heroPreview.src = videoPath;
                heroPreview.volume = 0.5;
                heroPreview.muted = !window.userInteracted; // unmute only after a user gesture
                heroPreview.currentTime = 0;
                heroPreview.play().catch(() => {
                    // Autoplay with audio might be blocked; fallback to muted
                    heroPreview.muted = true;
                    heroPreview.play().catch(() => {});
                });
                heroPreview.classList.add('is-visible');
                if (heroPreviewYT) {
                    heroPreviewYT.src = '';
                    heroPreviewYT.classList.remove('is-visible');
                }
            } else if (canUseYouTube && heroPreviewYT) {
                const mutedParam = window.userInteracted ? 0 : 1;
                const params = `autoplay=1&mute=${mutedParam}&controls=0&playsinline=1&loop=1&modestbranding=1&rel=0&enablejsapi=1`;
                const embedUrl = `https://www.youtube.com/embed/${youtubeId}?${params}&playlist=${youtubeId}`;
                heroPreviewYT.src = embedUrl;
                heroPreviewYT.classList.add('is-visible');
                // add a class on the slide container to draw a gradient over YT buttons
                const mainSlide = document.getElementById('mainImage');
                if (mainSlide) mainSlide.classList.add('yt-visible');
                // If user has interacted, try to set volume to 20% and unmute via postMessage
                if (window.userInteracted) {
                    setTimeout(() => {
                        try {
                            heroPreviewYT.contentWindow.postMessage(JSON.stringify({
                                event: 'command',
                                func: 'setVolume',
                                args: [20]
                            }), '*');
                            heroPreviewYT.contentWindow.postMessage(JSON.stringify({
                                event: 'command',
                                func: 'unMute',
                                args: []
                            }), '*');
                        } catch (e) {}
                    }, 400);
                }
                if (heroPreview) {
                    try { heroPreview.pause(); } catch (e) {}
                    heroPreview.classList.remove('is-visible');
                }
            } else {
                // invalid media; keep static image
                return;
            }
            const mainSlide = document.getElementById('mainImage');
            if (mainSlide) mainSlide.classList.add('is-previewing');
        } catch (e) {}
    }, PREVIEW_DELAY_MS);

    previewTimerBySlide.set(slideEl, startTimer);
}

function clearPreviewForSlide(slideEl) {
    const t = previewTimerBySlide.get(slideEl);
    if (t) clearTimeout(t);
    const heroPreview = document.getElementById('heroPreview');
    const heroPreviewYT = document.getElementById('heroPreviewYT');
    if (heroPreview) {
        try { heroPreview.pause(); } catch (e) {}
        heroPreview.classList.remove('is-visible');
    }
    if (heroPreviewYT) {
        heroPreviewYT.src = '';
        heroPreviewYT.classList.remove('is-visible');
    }
    const mainSlide = document.getElementById('mainImage');
    if (mainSlide) { mainSlide.classList.remove('is-previewing'); mainSlide.classList.remove('yt-visible'); }
}

function startVideo(activeSlide)
{
    let videoSource = document.getElementById('video');
    const player = document.getElementById('player');
    const overlaySource = document.getElementById('page-overlay');
    const videoOverlay = document.querySelector('.video-overlay');
    const hamburgerSource = document.getElementById('hamburger');
    const rawVideoPath = activeSlide?.dataset?.video;
    const rawYoutubeLink = activeSlide?.dataset?.youtube;
    const videoPath = (rawVideoPath && rawVideoPath !== 'undefined' && String(rawVideoPath).trim() !== '') ? rawVideoPath : '';
    const youtubeLink = extractYouTubeId((rawYoutubeLink && rawYoutubeLink !== 'undefined' && String(rawYoutubeLink).trim() !== '') ? rawYoutubeLink : '');
    const controls = document.querySelector('.controls');
    let closeButton = player.querySelector('.close-btn');

    console.log(videoOverlay);
    if (!videoPath && !youtubeLink)
    {
        return;
    }

    // Ensure hero preview is stopped/hidden while the player is open
    clearPreviewForSlide(activeSlide);
    const heroPreview = document.getElementById('heroPreview');
    const heroPreviewYT = document.getElementById('heroPreviewYT');
    if (heroPreview) { try { heroPreview.pause(); } catch (e) {} heroPreview.classList.remove('is-visible'); }
    if (heroPreviewYT) { heroPreviewYT.src = ''; heroPreviewYT.classList.remove('is-visible'); }

    // Clear any existing YouTube iframe if present
    const existingIframe = player.querySelector('iframe');
    if (existingIframe) {
        existingIframe.remove();
    }

    // adjust the style of overlaying elements
    hamburgerSource.style.opacity = 0;
    overlaySource.style.opacity = 0.2;
    player.style.transform = 'scale(1)';
    player.style.opacity = '1';
    isPlayerOpen = true;

    // close button should come back
    closeButton.style.display = 'block';
    player.style.display = 'flex';

    // if the link is a youtube link, set the youtube video player
    if (youtubeLink)
    {
        // append the youtube embed URL if we have one
        const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeLink}?autoplay=1`;

        // Create or update the iframe for YouTube video
        let iframe = player.querySelector('iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.width = '75%';
            iframe.height = '84%';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.zIndex = '100000'
            player.appendChild(iframe);
        }
        iframe.src = youtubeEmbedUrl;

        // we need to add back our close button to youtube videos
        if (!closeButton) {
            closeButton = document.createElement('button');
            closeButton.className = 'close-btn';
            closeButton.innerHTML = '&#10005;';
            player.appendChild(closeButton);
        }

        closeButton.onclick = function() {
            closeVideoPlayer();
        };

        if (videoSource) {
            videoSource.style.display = 'none';
            videoSource.pause();
            videoSource.removeAttribute('src');
        }

        controls.style.display = 'none';
        videoOverlay.style.display = 'none';
    }
    else if (videoPath)
    {
        // If the video is an in-page video, load custom video player
        if (!videoSource) {
            // Create video element if it doesn't exist
            videoSource = document.createElement('video');
            videoSource.id = 'video';
            player.appendChild(videoSource);
        }

        // if the video is an in-page video, load custom video player
        // don't auto-play here; this launcher is optional per your last request
        videoSource.poster = activeSlide?.dataset?.imageSrc || '';
        videoSource.src = videoPath;
        videoOverlay.style.display = 'flex';
        
        let closeButton = player.querySelector('.close-btn');
        if (!closeButton) {
            closeButton = document.createElement('button');
            closeButton.className = 'close-btn';
            closeButton.innerHTML = '&#10005;';
            player.appendChild(closeButton);
        }

        player.appendChild(videoSource);

        closeButton.onclick = function() {
            closeVideoPlayer();
        };

        controls.style.display = 'flex';
        videoSource.style.display = 'block';
        videoSource.load();
    }
}

// Function to add click events to each slide
function setupClickListeners(carouselId) {
    const carousel = document.getElementById(carouselId);
    const slides = carousel.querySelectorAll('.image-container');
    const playButton = document.getElementById('playButton');

    // handle clicking the play button to do same logic
    if (playButton)
    {
        playButton.addEventListener('click', () => {
            const activeCarousel = document.getElementById(selectedCarouselId);
            const activeSlide = activeCarousel.querySelector('.image-container.active');
            // Simulate clicking the active slide
            startVideo(activeSlide);
        });
    }

    slides.forEach((slide, index) => {

        slide.addEventListener('click', () => {
            let currentIndex = slideIndexes[carouselId];
            console.log(currentIndex);
            console.log(index);

            if (carouselId == selectedCarouselId)
            {
                if (currentIndex === index) {
                    // cause the video player's z Index to be primary target, and scale up the video player (animation)
                    const activeSlide = carousel.querySelector('.image-container.active');
                    // stop any preview before opening player
                    clearPreviewForSlide(activeSlide);
                    startVideo(activeSlide);
                } else {
                    let step = index - currentIndex; // Calculate the steps needed to make the clicked slide the active slide
                    moveSlide(step, carouselId); // Call moveSlide with the calculated step
                    // Clear active class from all slides
                    slides.forEach(s => { s.classList.remove('active'); clearPreviewForSlide(s); });
                    // Set active class to the clicked slide
                    slide.classList.add('active');
                }
            }
            else
            {
                    let step = index - currentIndex; // Calculate the steps needed to make the clicked slide the active slide
                    moveSlide(step, carouselId); // Call moveSlide with the calculated step
                    // Clear active class from all slides
                    slides.forEach(s => { s.classList.remove('active'); clearPreviewForSlide(s); });
                    // Set active class to the clicked slide
                    slide.classList.add('active');       
            }
            selectedCarouselId = carouselId;
            schedulePreviewForSlide(slide);
        });
    });
}

function initializeCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    const slides = Array.from(carousel.querySelectorAll('.image-container')); // Convert NodeList to Array
    const carouselSlideContainer = carousel.querySelector('.carousel-slide');
    
    if (slides.length > 0) {
        // const middleIndex = Math.round((slides.length / 2)-1);
        // const containerWidth = carousel.clientWidth;
        const imageWidth = slides[0].clientWidth;
        // let offset = (containerWidth); // Centering the middle slide

        const initialOffset = -slides[0].offsetLeft+imageWidth/2;

        carouselSlideContainer.style.transform = `translateX(${initialOffset}px)`;

        // set the starting index of the first carousel
        if (carouselsCreated == 0)
        {
            slideIndexes[carouselId] = 0;
            updateActiveSlides(carouselId);
        }
        else
        {
            slideIndexes[carouselId] = 0;
            slides.forEach((slide, index) => {

                const img = slide.querySelector('.carousel-image');
                const overlay = slide.querySelector('.overlay-image');

                if (img && overlay) {
                    img.classList.remove('active');
                    img.style.opacity = '0.25';
                    img.style.transform = 'scale(1)';
                    overlay.style.transform = 'scale(0)';
                } 
            });
        }
        
        carouselsCreated++;
    }
}
