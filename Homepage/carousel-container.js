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
    // in the case of small carousels, don't bother sliding
    if (slides.length <= 3)
        {
            updateActiveSlides(carouselId);
            return;
        }
    // Adjust slide position based on the new index
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

    slides.forEach((slide, index) => {
        const img = slide.querySelector('.carousel-image');
        const overlay = slide.querySelector('.overlay-image');

        console.log(`Slide ${index}: img found = ${!!img}, overlay found = ${!!overlay}`);  // Log whether each slide has the images

        if (img && overlay) {
            img.classList.remove('active');
            img.style.opacity = '0.3';
            overlay.style.opacity = '0.3';
            overlay.style.opacity = '0.2';
            overlay.style.transform = 'scale(0.5)';
        } else {
            console.error(`Missing .carousel-image or .overlay-image in slide at index ${index}`);
        }
    });

    const activeSlide = slides[slideIndexes[carouselId]];
    if (activeSlide) {
        const activeImg = activeSlide.querySelector('.carousel-image');
        const activeOverlay = activeSlide.querySelector('.overlay-image');

        if (activeImg && activeOverlay) {
            activeImg.classList.add('active');
            activeImg.style.opacity = '1';
            activeOverlay.style.opacity = '0.8';
            activeOverlay.style.transform = 'scale(0.8)';
        }
    }
}

// Function to add click events to each slide
function setupClickListeners(carouselId) {
    const carousel = document.getElementById(carouselId);
    const slides = carousel.querySelectorAll('.image-container');

    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            let currentIndex = slideIndexes[carouselId];
            let step = index - currentIndex; // Calculate the steps needed to make the clicked slide the active slide
            moveSlide(step, carouselId); // Call moveSlide with the calculated step
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

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.carousel-container').forEach(carousel => {
        const carouselId = carousel.id;
        initializeCarousel(carouselId);
        setupClickListeners(carouselId);
    });
});