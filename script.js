document.addEventListener('DOMContentLoaded', () => {
    loadCloudinaryGallery();
    setupScrollAnimations();
});

// --- 1. CLOUDINARY DYNAMIC GALLERY ---
function loadCloudinaryGallery() {
    // Your specific Cloudinary name
    const cloudName = 'dhvxjqjoi'; 
    // The tag you must apply to images in your Cloudinary dashboard
    const tag = 'portfolio'; 
    
    // Cloudinary automatically generates this JSON list for you
    const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`;
    const galleryContainer = document.getElementById('dynamic-gallery');

    if (!galleryContainer) return;

    fetch(listUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response failed. Ensure "Resource list" is enabled in Cloudinary Security settings.');
            }
            return response.json();
        })
        .then(data => {
            galleryContainer.innerHTML = ''; // Clear out any loading text

            // Setup the IntersectionObserver for mobile lazy loading
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.onload = () => img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '100px' });

            // Loop through the photos Cloudinary sends back
            data.resources.forEach(photo => {
                const img = document.createElement('img');
                
                // Cloudinary URL builder: q_auto,f_auto perfectly compresses the image for mobile
                const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`;
                
                // If you add Context Metadata in Cloudinary (Key: category, Value: outdoor/family/functions), it filters perfectly.
                // Otherwise, it defaults to the 'all' category.
                const category = photo.context && photo.context.custom && photo.context.custom.category 
                                 ? photo.context.custom.category 
                                 : 'all';

                img.className = `gallery-item ${category}`; 
                img.dataset.src = imageUrl;
                
                // Tiny transparent placeholder until the real image loads
                img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; 

                img.addEventListener('click', () => {
                    document.getElementById('lightbox').classList.add('active');
                    document.getElementById('lightbox-img').src = imageUrl;
                });

                galleryContainer.appendChild(img);
                imageObserver.observe(img);
            });
        })
        .catch(error => {
            console.error("Error loading gallery:", error);
            galleryContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem;">Unable to load gallery. Please check your Cloudinary Security Settings.</p>';
        });
}

// --- 2. FILTER & UTILS ---
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    
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
