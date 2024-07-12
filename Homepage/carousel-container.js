let slideIndexes = {};
var carouselsCreated = 0;
var selectedCarouselId = -1;

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
    playWhooshSound();
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
        
        if (activeImg && activeOverlay) {
            activeImg.classList.add('active');
            activeImg.style.opacity = '1';
            activeImg.style.transform = 'scale(1)';
            activeOverlay.style.transform = 'scale(0.75)';
        }
    }

    slides.forEach((slide, index) => {
        slides.forEach(s => s.classList.remove('active'));
    });

    // if the active slide is valid, flag it as such
    if (activeSlide)
    {
        activeSlide.classList.add('active');
    }

    updateActiveSlideDisplay(carouselId);
}

function startVideo(activeSlide)
{
    let videoSource = document.getElementById('video');
    const player = document.getElementById('player');
    const overlaySource = document.getElementById('page-overlay');
    const videoOverlay = document.querySelector('.video-overlay');
    const hamburgerSource = document.getElementById('hamburger');
    const videoPath = activeSlide.dataset.video;
    const youtubeLink = activeSlide.dataset.youtube;
    const controls = document.querySelector('.controls');
    let closeButton = player.querySelector('.close-btn');

    console.log(videoOverlay);
    if (videoPath == 'undefined' && youtubeLink == 'undefined')
        return;

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

    // close button should come back
    closeButton.style.display = 'block';
    player.style.display = 'flex';

    // if the link is a youtube link, set the youtube video player
    if (youtubeLink !== 'undefined')
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

        if (videoSource) 
            videoSource.style.display = 'none';

        controls.style.display = 'none';
        videoOverlay.style.display = 'none';
    }
    else
    {
        // If the video is an in-page video, load custom video player
        if (!videoSource) {
            // Create video element if it doesn't exist
            videoSource = document.createElement('video');
            videoSource.id = 'video';
            player.appendChild(videoSource);
        }

        // if the video is an in-page video, load custom video player
        videoSource.poster = activeSlide.dataset.imageSrc;
        videoSource.src = videoPath;
        
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
                    startVideo(activeSlide);
                } else {
                    let step = index - currentIndex; // Calculate the steps needed to make the clicked slide the active slide
                    moveSlide(step, carouselId); // Call moveSlide with the calculated step
                    // Clear active class from all slides
                    slides.forEach(s => s.classList.remove('active'));
                    // Set active class to the clicked slide
                    slide.classList.add('active');
                }
            }
            else
            {
                    let step = index - currentIndex; // Calculate the steps needed to make the clicked slide the active slide
                    moveSlide(step, carouselId); // Call moveSlide with the calculated step
                    // Clear active class from all slides
                    slides.forEach(s => s.classList.remove('active'));
                    // Set active class to the clicked slide
                    slide.classList.add('active');       
            }
            selectedCarouselId = carouselId;
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
