// --- 1. YOUR PHOTO MANAGER ---
const myPhotos = [
    { filename: 'b1.jpg', category: 'family' },
    { filename: 'b3.jpg', category: 'couples' },
    { filename: 'b5.jpg', category: 'family' },
    { filename: 'a.jpg', category: 'couples' },
    { filename: 'a2.jpg', category: 'family' },
    { filename: 'b5.jpg', category: 'couples' },
    { filename: 'b7.jpg', category: 'family' },
    { filename: 'b.jpg', category: 'couples' },
    { filename: 's1.jpg', category: 'family' },
    { filename: 's4.jpg', category: 'couples' },
    { filename: 's6.jpg', category: 'family' },
    { filename: 'sa1.jpg', category: 'couples' },
    { filename: 'sa3.jpg', category: 'family' },
    { filename: 'sa5.jpg', category: 'couples' },
    { filename: 'sa5.jpg', category: 'family' },
    { filename: 'sa7.jpg', category: 'couples' }
];

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
    event.target.classList.add('active');

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

const faders = document.querySelectorAll('.fade-in');
const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.15 });

faders.forEach(fader => appearOnScroll.observe(fader));
