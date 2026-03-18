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

// --- 2. BUILD THE GALLERY AUTOMATICALLY ---
// This wrapper is the secret—it makes the gallery load immediately!
document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    setupAnimations();
});

function loadGallery() {
    const galleryContainer = document.getElementById('dynamic-gallery');
    if (!galleryContainer) return;

    galleryContainer.innerHTML = ''; 
    
    myPhotos.forEach((photo) => {
        const img = document.createElement('img');
        
        // 1. Load the tiny version for the gallery grid (FAST)
        img.src = `thumbnails/${photo.filename}`; 
        
        img.className = `gallery-item ${photo.category}`;
        img.alt = "SKC Moments Photography";
        img.loading = "lazy"; 

        img.addEventListener('click', () => {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            lightbox.classList.add('active');
            
            // 2. Load the high-res version ONLY when they click it
            lightboxImg.src = `images/${photo.filename}`; 
        });

        galleryContainer.appendChild(img);
    });
}

// --- 3. FILTER BUTTONS ---
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const btns = document.querySelectorAll('.filter-btn');
    
    btns.forEach(btn => btn.classList.remove('active'));
    
    // Find button and set active
    const clickedBtn = Array.from(btns).find(btn => btn.getAttribute('onclick').includes(`'${category}'`));
    if (clickedBtn) clickedBtn.classList.add('active');

    items.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// --- 4. LIGHTBOX CLOSE ---
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

// --- 5. STICKY NAV & SCROLL ANIMATIONS ---
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

function setupAnimations() {
    const faders = document.querySelectorAll('.fade-in');
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });
    faders.forEach(fader => appearOnScroll.observe(fader));
}