document.addEventListener('DOMContentLoaded', () => {
    loadCloudinaryGallery();
    setupScrollAnimations();
});

// --- 1. CLOUDINARY DYNAMIC GALLERY ---
function loadCloudinaryGallery() {
    const cloudName = 'dhvxjqjoi'; 
    const tag = 'skc_gallery'; // Your new, un-cached bulk tag
    
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

            // The Bulletproof Mobile Observer
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // 1. Tell the browser to download the image
                        img.src = img.dataset.src;
                        
                        // 2. Check if the mobile phone already has it saved in cache
                        if (img.complete) {
                            img.classList.add('loaded');
                        } else {
                            // 3. If not in cache, wait for it to finish downloading
                            img.onload = () => {
                                img.classList.add('loaded');
                            };
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '500px' }); // Gives mobile plenty of time to load before scrolling

            data.resources.forEach(photo => {
                const img = document.createElement('img');
                
                // Lightweight 600px thumbnail for the grid
                const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_600,c_scale,q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`;
                
                // Heavy high-res original for the lightbox
                const lightboxUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`;
                
                // Read category for your filter buttons
                const category = photo.context && photo.context.custom && photo.context.custom.category 
                                 ? photo.context.custom.category 
                                 : 'all';

                img.className = `gallery-item ${category}`; 
                img.dataset.src = thumbnailUrl; 

                // Open lightbox on click
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
