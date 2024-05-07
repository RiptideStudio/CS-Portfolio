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
    const links = carousel.querySelectorAll('a'); 

    slides.forEach((slide, index) => {

        const img = slide.querySelector('.carousel-image');
        const overlay = slide.querySelector('.overlay-image');
        const link = links[index];  // Corresponding link for each slide.

        console.log(`Slide ${index}: img found = ${!!img}, overlay found = ${!!overlay}`);  // Log whether each slide has the images

        if (img && overlay) {
            img.classList.remove('active');
            img.style.opacity = '0.4';
            overlay.style.opacity = '0.4';
            overlay.style.transform = 'scale(0.5)';
            if (link)
            {
                link.style.pointerEvents = 'none';
            }
        } else {
            console.error(`Missing .carousel-image or .overlay-image in slide at index ${index}`);
        }
    });

    slides.forEach((slide, index) => {
        const link = slide.querySelector('a');
        if (!link) {
            console.error(`Link not found in slide at index ${index}`);
            return;
        }

        if (slide.classList.contains('active')) {
            link.style.pointerEvents = 'auto'; // Link is clickable.
        } else {
            link.style.pointerEvents = 'none'; // Link is not clickable.
        }
    });

    const activeSlide = slides[slideIndexes[carouselId]];
    if (activeSlide) {
        const activeImg = activeSlide.querySelector('.carousel-image');
        const activeOverlay = activeSlide.querySelector('.overlay-image');
        const link = activeSlide.querySelector('a');
        
        if (activeImg && activeOverlay) {
            activeImg.classList.add('active');
            activeImg.style.opacity = '1';
            activeOverlay.style.opacity = '0.8';
            activeOverlay.style.transform = 'scale(0.8)';
            if (link)
            {
                link.style.pointerEvents = 'auto';
            }
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

document.querySelectorAll('.carousel-container .image-container').forEach(container => {
    container.addEventListener('click', function() {
        // Remove active class from all containers
        document.querySelectorAll('.carousel-container .image-container').forEach(c => {
            c.classList.remove('active');
        });
        // Add active class to clicked container
        this.classList.add('active');
        updateActiveSlides(carouselId); // Make sure to pass the correct carouselId
    });
})