// --- 1. FIREBASE INITIALIZATION ---
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

document.addEventListener('DOMContentLoaded', () => {
    listenToGalleryUpdates();
    setupScrollAnimations();
});

// --- 2. DYNAMIC GALLERY SYNC ---
function listenToGalleryUpdates() {
    const galleryContainer = document.getElementById('dynamic-gallery');
    if (!galleryContainer) return;

    // Listen to Firebase realtime database
    database.ref('photos').on('value', (snapshot) => {
        galleryContainer.innerHTML = ''; 
        
        const data = snapshot.val();
        if (!data) {
            galleryContainer.innerHTML = '<p class="text-muted" style="grid-column: 1 / -1; text-align: center;">No photos uploaded yet.</p>';
            return;
        }

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

        Object.keys(data).forEach(key => {
            const photo = data[key];
            
            const img = document.createElement('img');
            img.className = `gallery-item ${photo.category}`;
            img.dataset.src = photo.url; 
            img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

            img.addEventListener('click', () => {
                document.getElementById('lightbox').classList.add('active');
                document.getElementById('lightbox-img').src = photo.url;
            });

            galleryContainer.appendChild(img);
            imageObserver.observe(img);
        });
    });
}

// --- 3. THE LIVE UPLOAD LOGIC ---
function handleUpload() {
    const fileInput = document.getElementById('photo-file');
    const categorySelect = document.getElementById('photo-category');
    const statusDiv = document.getElementById('upload-status');
    const uploadBtn = document.getElementById('btn-upload');

    const file = fileInput.files[0];
    const category = categorySelect.value;

    if (!file) {
        statusDiv.innerHTML = "<span style='color: red;'>Please select a photo first!</span>";
        return;
    }

    uploadBtn.disabled = true;
    uploadBtn.innerText = "Uploading...";
    statusDiv.innerHTML = "Processing asset storage...";

    const storageRef = storage.ref('gallery/' + Date.now() + '_' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        (snapshot) => {}, 
        (error) => {
            statusDiv.innerHTML = `<span style='color: red;'>Error: ${error.message}</span>`;
            uploadBtn.disabled = false;
            uploadBtn.innerText = "Upload Photo";
        }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                database.ref('photos').push({
                    url: downloadURL,
                    category: category,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    statusDiv.innerHTML = "<span style='color: green;'>Success! Gallery updated dynamically.</span>";
                    fileInput.value = ''; 
                    uploadBtn.disabled = false;
                    uploadBtn.innerText = "Upload Photo";
                });
            });
        }
    );
}

// --- FILTER & UTILS ---
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
