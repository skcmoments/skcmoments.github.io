
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

// The rest of your script.js (loadGallery, filterGallery, etc.) remains the same!

// --- 2. BUILD THE GALLERY AUTOMATICALLY ---
const galleryContainer = document.getElementById('dynamic-gallery');

function loadGallery() {
    galleryContainer.innerHTML = ''; 
    myPhotos.forEach(photo => {
        const img = document.createElement('img');
        
        // Load the small thumbnail for the grid
        img.src = `thumbnails/${photo.filename}`; 
        img.className = `gallery-item ${photo.category}`;
        img.loading = "lazy"; // Only loads as the user scrolls down
        
        img.addEventListener('click', () => {
            document.getElementById('lightbox').classList.add('active');
            // ONLY load the high-res "big" version when they actually click to see it
            document.getElementById('lightbox-img').src = `images/${photo.filename}`;
        });

        galleryContainer.appendChild(img);
    });
}
loadGallery();

// --- 3. FILTER BUTTONS ---
// --- 3. FILTER BUTTONS ---
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const btns = document.querySelectorAll('.filter-btn');
    
    // Remove the 'active' underline from all buttons
    btns.forEach(btn => btn.classList.remove('active'));
    
    // Find the button that was clicked and add the 'active' underline
    // We use Array.from to find the button that has the matching category in its onclick
    const clickedBtn = Array.from(btns).find(btn => btn.getAttribute('onclick').includes(`'${category}'`));
    if (clickedBtn) clickedBtn.classList.add('active');

    // Show or hide images
    items.forEach(item => {
        // We check if the image has the category class (e.g. class="gallery-item outdoor")
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

const faders = document.querySelectorAll('.fade-in');
const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.15 });

faders.forEach(fader => appearOnScroll.observe(fader));
