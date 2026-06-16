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

    fetch(listUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response failed. Ensure "Resource list" is enabled in Cloudinary Security settings.');
            }
            return response.json();
        })
        .then(data => {
            galleryContainer.innerHTML = ''; 

            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        img.src = img.dataset.src;
                        
                        if (img.complete) {
                            img.classList.add('loaded');
                        } else {
                            img.onload = () => {
                                img.classList.add('loaded');
                            };
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '500px' }); 

            data.resources.forEach(photo => {
                const img = document.createElement('img');
                
                const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_600,c_scale,q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`;
                const lightboxUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`;
                
                const category = photo.context && photo.context.custom && photo.context.custom.category 
                                 ? photo.context.custom.category 
                                 : 'all';

                img.className = `gallery-item ${category}`; 
                img.dataset.src = thumbnailUrl; 

                img.addEventListener('click', () => {
                    document.getElementById('lightbox').classList.add('active');
                    document.getElementById('lightbox-img').src = lightboxUrl;
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
