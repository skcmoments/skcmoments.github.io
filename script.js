document.addEventListener('DOMContentLoaded', () => {
    loadCloudinaryGallery();
    setupScrollAnimations();
});

// --- 1. CLOUDINARY DYNAMIC GALLERY ---
function loadCloudinaryGallery() {
    const cloudName = 'dhvxjqjoi'; 
    const tag = 'skc_gallery'; 
    
    const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`;
    const galleryContainer = document.getElementById('dynamic-gallery');

    if (!galleryContainer) return;

    // Determine if we are on the dedicated gallery page
    const isGalleryPage = window.location.pathname.includes('gallery');

    fetch(listUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response failed.');
            }
            return response.json();
        })
        .then(data => {
            galleryContainer.innerHTML = ''; 

            // Create the stylish 6th "View All" Tile
            const viewAllTile = document.createElement('div');
            viewAllTile.className = 'gallery-item view-all-tile loaded'; 
            viewAllTile.innerHTML = '<span>View All<br>Photos</span>';
            
            // THE FIX: Force the browser to go to the new page
            viewAllTile.addEventListener('click', () => {
                window.location.href = 'gallery.html'; 
            });

            data.resources.forEach((photo, index) => {
                const img = document.createElement('img');
                
                const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_600,c_scale,q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`;
                const lightboxUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`;
                
                const category = photo.context && photo.context.custom && photo.context.custom.category 
                                 ? photo.context.custom.category 
                                 : 'all';

                img.className = `gallery-item ${category}`; 
                
                // NATIVE MOBILE LAZY LOADING
                img.loading = 'lazy';
                img.src = thumbnailUrl; 

                img.onload = () => {
                    img.classList.add('loaded');
                };

                img.addEventListener('click', () => {
                    document.getElementById('lightbox').classList.add('active');
                    document.getElementById('lightbox-img').src = lightboxUrl;
                });

                // Smart Loading Logic: Homepage vs Gallery Page
                if (!isGalleryPage) {
                    // Homepage: Stop at 5 images and append the tile
                    if (index < 5) {
                        galleryContainer.appendChild(img);
                    }
                    if (index === 4 && data.resources.length > 5) {
                        galleryContainer.appendChild(viewAllTile);
                    }
                } else {
                    // Gallery Page: Show everything
                    galleryContainer.appendChild(img);
                }
            });
        })
        .catch(error => {
            console.error("Error loading gallery:", error);
            galleryContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem;">Unable to load gallery.</p>';
        });
}

// --- 2. FILTER & UTILS ---
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const btns = document.querySelectorAll('.filter-btn');
    
    btns.forEach(btn => btn.classList.remove('active'));
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

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
    document.getElementById('lightbox-img').src = ''; 
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