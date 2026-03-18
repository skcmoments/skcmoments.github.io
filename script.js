
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
        
        if (photo.filename.startsWith('http')) {
            img.src = photo.filename;
        } else {
            img.src = `images/${photo.filename}`; 
        }
        
        img.className = `gallery-item ${photo.category}`;
        img.alt = "SKC Moments Photography";
        
        img.addEventListener('click', () => {
            document.getElementById('lightbox').classList.add('active');
            document.getElementById('lightbox-img').src = img.src;
        });

        galleryContainer.appendChild(img);
    });
}
loadGallery();

// --- 3. FILTER BUTTONS ---
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const btns = document.querySelectorAll('.filter-btn');
    
    btns.forEach(btn => btn.classList.remove('active'));
    // Use event.currentTarget to be more reliable
    if (event) event.target.classList.add('active');

    items.forEach(item => {
        // This is the logic that matches the button word to the category word
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
