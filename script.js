// --- 1. YOUR PHOTO MANAGER ---
const myPhotos = [
    { filename: 'b1.jpg', category: 'outdoor' },
    { filename: 'b3.jpg', category: 'outdoor' },
    { filename: 'b5.jpg', category: 'outdoor' },
    { filename: 'a.jpg', category: 'functions' },
    { filename: 'a2.jpg', category: 'family' },
    { filename: 'a5.jpg', category: 'family' },
    { filename: 'e.jpg', category: 'functions' },
    { filename: 'b.jpg', category: 'functions' },
    { filename: 's1.jpg', category: 'family' },
    { filename: 's4.jpg', category: 'family' },
    { filename: 's6.jpg', category: 'family' },
    { filename: 'sa1.jpg', category: 'functions' },
    { filename: 'sa3.jpg', category: 'functions' },
    { filename: 'sa5.jpg', category: 'functions' },
    { filename: 'sa7.jpg', category: 'outdoor' }
];

document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    setupScrollAnimations();
});

function loadGallery() {
    const galleryContainer = document.getElementById('dynamic-gallery');
    if (!galleryContainer) return;

    galleryContainer.innerHTML = ''; 

    // This "Observer" watches each image and loads it only when it's on screen
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Moves the real URL into the src
                img.onload = () => img.classList.add('loaded');
                observer.unobserve(img); // Stop watching once loaded
            }
        });
    }, { rootMargin: '50px' }); // Starts loading 50px before it enters the screen

    myPhotos.forEach(photo => {
        const img = document.createElement('img');
        img.className = `gallery-item ${photo.category}`;
        
        // WE USE "data-src" INSTEAD OF "src" TO PREVENT THE LAG
        img.dataset.src = `images/${photo.filename}`; 
        
        // This is a tiny invisible placeholder so the box exists
        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

        img.addEventListener('click', () => {
            document.getElementById('lightbox').classList.add('active');
            document.getElementById('lightbox-img').src = `images/${photo.filename}`;
        });

        galleryContainer.appendChild(img);
        imageObserver.observe(img); // Start watching this image
    });
}

// --- FILTER & UTILS ---
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    
    // Safety check for the click event
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    items.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

function setupScrollAnimations() {
    const faders = document.querySelectorAll('.fade-in');
    const appearOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.1 });
    faders.forEach(fader => appearOnScroll.observe(fader));
}