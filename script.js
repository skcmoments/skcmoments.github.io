// --- 1. YOUR PHOTO MANAGER ---
const myPhotos = [
    { filename: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=800', category: 'family' },
    { filename: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800', category: 'couples' },
    { filename: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800', category: 'family' },
    { filename: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800', category: 'couples' }
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