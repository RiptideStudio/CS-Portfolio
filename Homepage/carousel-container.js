let slideIndexes = {};

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
}

function updateSlidePosition(carouselId, newIndex) {
    const carousel = document.getElementById(carouselId);
    const slides = carousel.querySelectorAll('.image-container');
    const containerWidth = carousel.clientWidth;
    const imageWidth = slides[0].clientWidth;
    const offset = (containerWidth - imageWidth) / 2;
    const newLeft = -slides[newIndex].offsetLeft + offset;

    carousel.querySelector('.carousel-slide').style.transform = `translateX(${newLeft}px)`;
}

function updateActiveSlides(carouselId) {
    const carousel = document.getElementById(carouselId);
    const slides = carousel.querySelectorAll('.image-container');
    const activeIndex = slideIndexes[carouselId];

    // reset properties of the slides
    slides.forEach((slide, index) => {

        const img = slide.querySelector('.carousel-image');
        const overlay = slide.querySelector('.overlay-image');

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
            const overlay = slide.querySelector('.overlay-image');
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
    activeSlide.classList.add('active');
    updateActiveSlideDisplay(carouselId);
}

// Function to add click events to each slide
function setupClickListeners(carouselId) {
    const carousel = document.getElementById(carouselId);
    const slides = carousel.querySelectorAll('.image-container');
    let savedTime = 0;

    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            let currentIndex = slideIndexes[carouselId];
            if (currentIndex === index) {
                
                // cause the video player's z Index to be primary target, and scale up the video player (animation)
                const activeSlide = carousel.querySelector('.image-container.active');
                const videoPath = activeSlide.dataset.video;
                
                if (videoPath)
                {
                    const videoSource = document.getElementById('video');
                    const player = document.getElementById('player');
                    
                    if (!videoSource.src.includes(videoPath))
                    {
                        videoSource.poster = activeSlide.dataset.imageSrc;
                        videoSource.src = videoPath;
                    }

                    player.style.transform = 'scale(1)';
                    player.style.opacity = '1';
                }

            } else {
                let step = index - currentIndex; // Calculate the steps needed to make the clicked slide the active slide
                moveSlide(step, carouselId); // Call moveSlide with the calculated step
                // Clear active class from all slides
                slides.forEach(s => s.classList.remove('active'));
                // Set active class to the clicked slide
                slide.classList.add('active');
            }
        });
    });
}


function initializeCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    const slides = Array.from(carousel.querySelectorAll('.image-container')); // Convert NodeList to Array
    const carouselSlideContainer = carousel.querySelector('.carousel-slide');

    if (slides.length > 0) {
        const middleIndex = Math.floor(slides.length / 2);
        slideIndexes[carouselId] = middleIndex; // Set the middle slide as the starting index

        const containerWidth = carousel.clientWidth;
        const imageWidth = slides[0].clientWidth;
        const totalWidthOfSlides = slides.reduce((acc, slide) => acc + slide.clientWidth, 0);

        let offset = (containerWidth - imageWidth) / 2; // Centering the middle slide
        let newLeft = -slides[middleIndex].offsetLeft + offset;

        carouselSlideContainer.style.transform = `translateX(${newLeft}px)`;
        updateActiveSlides(carouselId);
    }
}
