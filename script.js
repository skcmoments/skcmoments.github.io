let currentPhotoIndex = 0;
let photoData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCloudinaryGallery();
    setupScrollAnimations();
});

function loadCloudinaryGallery() {
    const cloudName = 'dhvxjqjoi'; 
    const tag = 'skc_gallery'; 
    const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`;
    const galleryContainer = document.getElementById('dynamic-gallery');
    const isGalleryPage = window.location.pathname.includes('gallery');

    if (!galleryContainer) return;

    fetch(listUrl)
        .then(response => response.json())
        .then(data => {
            photoData = data.resources;
            galleryContainer.innerHTML = ''; 

            const viewAllTile = document.createElement('div');
            viewAllTile.className = 'gallery-item view-all-tile loaded'; 
            viewAllTile.innerHTML = '<span>View All<br>Photos</span>';
            viewAllTile.addEventListener('click', () => window.location.href = 'gallery.html');

            data.resources.forEach((photo, index) => {
                const img = document.createElement('img');
                const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_600,c_scale,q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`;
                const lightboxUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`;
                
                img.className = `gallery-item ${photo.context?.custom?.category || 'all'}`; 
                img.loading = 'lazy';
                img.src = thumbnailUrl; 

                img.onload = () => img.classList.add('loaded');
                img.addEventListener('click', () => {
                    currentPhotoIndex = index;
                    openLightbox(lightboxUrl);
                });

                if (!isGalleryPage) {
                    if (index < 5) galleryContainer.appendChild(img);
                    if (index === 4 && data.resources.length > 5) galleryContainer.appendChild(viewAllTile);
                } else {
                    galleryContainer.appendChild(img);
                }
            });
        });
}

function openLightbox(url) {
    document.getElementById('lightbox').classList.add('active');
    document.getElementById('lightbox-img').src = url;
}

function changeImage(direction) {
    currentPhotoIndex = (currentPhotoIndex + direction + photoData.length) % photoData.length;
    const photo = photoData[currentPhotoIndex];
    document.getElementById('lightbox-img').src = `https://res.cloudinary.com/dhvxjqjoi/image/upload/q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`;
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

function filterGallery(category, clickedElement) {
    // 1. Update image display
    document.querySelectorAll('.gallery-item').forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });

    // 2. Remove 'active' class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Add 'active' class to clicked button
    clickedElement.classList.add('active');
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('appear'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(fader => observer.observe(fader));
}

window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 50);
});