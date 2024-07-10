let slideIndexes = {};
var carouselsCreated = 0;
var selectedCarouselId = -1;

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
    const videoSource = document.getElementById('video');
    const player = document.getElementById('player');
    const overlaySource = document.getElementById('page-overlay');
    const hamburgerSource = document.getElementById('hamburger');
    const videoPath = activeSlide.dataset.video;

    if (!videoPath)
        return;

    if (!videoSource.src.includes(videoPath))
    {
        videoSource.poster = activeSlide.dataset.imageSrc;
        videoSource.src = videoPath;
    }

    hamburgerSource.style.opacity = 0;
    overlaySource.style.opacity = 0.2;
    player.style.transform = 'scale(1)';
    player.style.opacity = '1';
}

function moveSlideActiveCarousel(step, id)
{

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
            const activeSlide = carousel.querySelector('.image-container.active');
            // Simulate clicking the active slide
            startVideo(activeSlide);
        });
    }

    slides.forEach((slide, index) => {

        slide.addEventListener('click', () => {
            let currentIndex = slideIndexes[carouselId];

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
        const middleIndex = Math.round((slides.length / 2)-1);
        const containerWidth = carousel.clientWidth;
        const imageWidth = slides[0].clientWidth;

        let offset = (containerWidth - imageWidth) / 2; // Centering the middle slide
        let newLeft = -slides[middleIndex].offsetLeft + offset;

        carouselSlideContainer.style.transform = `translateX(${newLeft}px)`;
        const allCarousels = document.querySelectorAll('.carousel-container');

        // set the starting index of the first carousel
        if (carouselsCreated == 0)
        {
            slideIndexes[carouselId] = middleIndex; // Set the middle slide as the starting index
            updateActiveSlides(carouselId);
        }
        else
        {
            slideIndexes[carouselId] = -1;
            
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
