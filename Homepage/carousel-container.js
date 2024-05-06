let slideIndexes = {};

// Function to handle the sliding of the carousel
function moveSlide(step, carouselId) {

    const carousel = document.getElementById(carouselId);
    const slides = carousel.querySelectorAll('.image-container');

    if (!slideIndexes.hasOwnProperty(carouselId)) {
        slideIndexes[carouselId] = Math.floor(slides.length / 2);
    }
    

    let newIndex = slideIndexes[carouselId] + step;
    newIndex = ((newIndex % slides.length) + slides.length) % slides.length; // Proper wrap-around

    slideIndexes[carouselId] = newIndex; // Update the slide index

    // in the case of small carousels, don't bother sliding
    if (slides.length <= 3)
    {
        updateActiveSlides(carouselId);
        return;
    }

    const containerWidth = carousel.clientWidth;
    const imageWidth = slides[0].clientWidth;
    const offset = (containerWidth - imageWidth) / 2; // Calculate the offset to center the slide
    let newLeft = -slides[newIndex].offsetLeft + offset; // Adjust based on actual slide offset

    carousel.querySelector('.carousel-slide').style.transform = `translateX(${newLeft}px)`;

    updateActiveSlides(carouselId);
}


// Function to update which slide is active
function updateActiveSlides(carouselId) {
    const carousel = document.getElementById(carouselId);
    const slides = carousel.querySelectorAll('.image-container img'); // Ensure this selector is correct and that all slides contain an <img>

    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        slide.style.opacity = '0.3';
    });

    if (slides.length > 0 && slideIndexes[carouselId] < slides.length) {
        const activeSlide = slides[slideIndexes[carouselId]];
        if (activeSlide) { // Ensure the element exists before attempting to modify it
            activeSlide.classList.add('active');
            activeSlide.style.opacity = '0.9';
        }
    } else {
        console.error('Error: slide index out of bounds or no slides found', slideIndexes[carouselId], slides.length);
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

window.addEventListener('resize', function() {
    document.querySelectorAll('.carousel-container').forEach(carousel => {
        initializeCarousel(carousel.id);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        const carouselId = carousel.id;
        setupClickListeners(carouselId);
        initializeCarousel(carouselId);
    });
});
