document.addEventListener('DOMContentLoaded', function() {
    fetch('Data/projects.json')  // Ensure the path to your JSON file is correct
        .then(response => response.json())
        .then(data => {
            data.forEach(item => createCarouselSlide(item));
            initializeCarousels();  // This initializes carousels after slides are created
        })
        .catch(error => console.error('Error loading the projects:', error));
});

function createCarouselSlide(item) {
    const carouselId = 'games-carousel';  // Adjust this ID as needed
    const carousel = document.getElementById(carouselId);
    const carouselSlide = carousel.querySelector('.carousel-slide');

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.dataset.title = item.title;  // Store the title
    imageContainer.dataset.description = item.description;  // Store the description
    imageContainer.dataset.overlayImageSrc = item.overlayImageSrc;
    imageContainer.dataset.imageSrc = item.imageSrc;
    imageContainer.dataset.projectLink = item.projectLink;
    imageContainer.dataset.genre = item.genre;
    imageContainer.dataset.role = item.role;
    
    // Add main image
    const img = document.createElement('img');
    img.className = 'carousel-image';
    img.src = item.imageSrc;
    imageContainer.appendChild(img);

    // Add overlay text
    const overlayText = document.createElement('div');
    overlayText.className = 'overlay-text';
    overlayText.textContent = item.role;
    imageContainer.appendChild(overlayText);

    // Add overlay image
    const overlayImg = document.createElement('img');
    overlayImg.className = 'overlay-image';
    overlayImg.style.transform = 'scale(0.5)';
    overlayImg.src = item.overlayImageSrc;
    imageContainer.appendChild(overlayImg);

    console.log("Creating slide for:", item.title);
    console.log("Overlay text content:", overlayText.textContent);
    
    // Optionally add a link
    if (item.link) {
        const link = document.createElement('a');
        link.href = item.link;
        link.appendChild(imageContainer);  // Wrap image container in a link
        carouselSlide.appendChild(link);
    } else {
        carouselSlide.appendChild(imageContainer);
    }
}

function initializeCarousels() {
    document.querySelectorAll('.carousel-container').forEach(carousel => {
        const carouselId = carousel.id;
        initializeCarousel(carouselId);
        setupClickListeners(carouselId);

        const slides = carousel.querySelectorAll('.image-container');
        if (!carousel.querySelector('.image-container.active') && slides.length > 0) {
            slides[0].classList.add('active'); // Set the first slide as active
        }
        updateActiveSlideDisplay(carouselId);
    });
}

// Function to change the slide
let currentSlideIndex = 0;
let slidesData = []; 

function changeSlide(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex >= slidesData.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slidesData.length - 1;
    }
    updateSubActiveSlideDisplay();
}

// Function to update the display based on the current slide
function updateSubActiveSlideDisplay() {
    const slide = slidesData[currentSlideIndex];
    if (!slide) return;

    document.getElementById('mainImage').src = slide.imageSrc;
    document.getElementById('slideTitle').textContent = slide.title;
    document.getElementById('slideDescription').textContent = slide.description;
}

function updateActiveSlideDisplay(carouselId) {
    const carousel = document.getElementById(carouselId);
    const activeSlide = carousel.querySelector('.image-container.active');  // Assumes you have 'active' class set on the active slide
    if (!activeSlide) return;  // If there's no active slide, do nothing

    const title = activeSlide.dataset.title;  // Assuming you store the title in data attributes
    const description = activeSlide.dataset.description;  // Assuming description is also stored

    const titleElement = document.querySelector('.game-text-container h1');
    const descriptionElement = document.querySelector('.game-text-container p');
    
    titleElement.textContent = title;

    if (activeSlide) {
        const title = activeSlide.dataset.title;
        const description = activeSlide.dataset.description;

        const titleElement = document.querySelector('.game-text-container h1');
        const descriptionElement = document.querySelector('.game-text-container p');
        const imageOverlayElement = document.querySelector('.game-text-container .slide-icon');
        const imageSrcElement = document.querySelector('.slideshow-container .slide');
        const linkElement = document.querySelector('.game-text-container .game-text-link a');
        const genreElement = document.querySelector('.game-text-container .game-text-genre');
        const roleElement = document.querySelector('.game-text-container .game-text-role');
        
        console.log(linkElement);
        console.log(activeSlide.dataset.projectLink);
        
        titleElement.textContent = title;
        descriptionElement.textContent = description;
        imageOverlayElement.src = activeSlide.dataset.overlayImageSrc;
        imageSrcElement.src = activeSlide.dataset.imageSrc;
        roleElement.textContent = activeSlide.dataset.role+" | "+activeSlide.dataset.genre;
        // genreElement.textContent = activeSlide.dataset.genre;
        linkElement.href = activeSlide.dataset.projectLink;

    } else {
        console.error("No active slide found.");
    }

    descriptionElement.textContent = description;
}
