const gallery_sshihabb007 = document.getElementById('gallery');
const themeToggle_sshihabb007 = document.getElementById('themeToggle');
const sortFilter_sshihabb007 = document.getElementById('sortFilter');
const lightbox_sshihabb007 = document.getElementById('lightbox');
const lightboxImg_sshihabb007 = document.getElementById('lightboxImg');
const closeLightbox_sshihabb007 = document.getElementById('closeLightbox');

let allPhotos_sshihabb007 = [];

// 1. Fetch, Setup, and Render
async function initGallery_sshihabb007() {
    try {
        // LOCAL AUTOMATION FIX: Trigger PHP script if on XAMPP to rebuild photos.json dynamically
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            try { await fetch('generate.php?t=' + Date.now()); } catch(e) { }
        }

        const response_sshihabb007 = await fetch('photos.json?t=' + Date.now());
        if (!response_sshihabb007.ok) throw new Error("JSON not found. Upload photos first!");
        
        allPhotos_sshihabb007 = await response_sshihabb007.json();
        
        if (allPhotos_sshihabb007.length === 0) {
            gallery_sshihabb007.innerHTML = '<p class="col-span-full text-center py-20">No photos found in UPLOAD folder.</p>';
            return;
        }

        renderGallery_sshihabb007();
    } catch (err_sshihabb007) {
        console.error(err_sshihabb007);
        gallery_sshihabb007.innerHTML = `<p class="col-span-full text-red-500 text-center py-20">Error loading images.</p>`;
    }
}

// 2. Main Render Logic
function renderGallery_sshihabb007() {
    gallery_sshihabb007.innerHTML = '';
    
    // Apply Sort filter
    const sortVal = sortFilter_sshihabb007.value;
    
    let filteredPhotos_sshihabb007 = [...allPhotos_sshihabb007];
    const nowTime = Math.floor(Date.now() / 1000);
    const day = 86400;
    
    if (sortVal === '1week') {
        filteredPhotos_sshihabb007 = filteredPhotos_sshihabb007.filter(p => (nowTime - p.timestamp) <= day * 7);
    } else if (sortVal === '1month') {
        filteredPhotos_sshihabb007 = filteredPhotos_sshihabb007.filter(p => (nowTime - p.timestamp) <= day * 30);
    } else if (sortVal === '2months') {
        filteredPhotos_sshihabb007 = filteredPhotos_sshihabb007.filter(p => (nowTime - p.timestamp) <= day * 60);
    } else if (sortVal === '3months') {
        filteredPhotos_sshihabb007 = filteredPhotos_sshihabb007.filter(p => (nowTime - p.timestamp) <= day * 90);
    }

    filteredPhotos_sshihabb007.sort((a, b) => {
        return sortVal === 'oldest' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
    });

    if (filteredPhotos_sshihabb007.length === 0) {
        gallery_sshihabb007.innerHTML = '<p class="col-span-full text-center py-20 opacity-50">No photos match this filter.</p>';
        return;
    }

    filteredPhotos_sshihabb007.forEach(photo_sshihabb007 => {
        // Fallback to original url if thumb_url is missing
        const imgSrc = photo_sshihabb007.thumb_url || photo_sshihabb007.url;
        const hdSrc = photo_sshihabb007.url;

        const card_sshihabb007 = `
            <div class="break-inside-avoid group relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 cursor-pointer" onclick="openLightbox_sshihabb007('${hdSrc}')">
                <img 
                    src="${imgSrc}" 
                    loading="lazy" 
                    alt="Model Photography"
                    class="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                />
                <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p class="text-white text-xs font-mono drop-shadow-md">Uploaded: ${new Date(photo_sshihabb007.timestamp * 1000).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        gallery_sshihabb007.innerHTML += card_sshihabb007;
    });
}

// 3. Grid Controls
window.setGridSize_sshihabb007 = function(size) {
    if (size === 'small') {
        gallery_sshihabb007.className = "columns-3 sm:columns-4 md:columns-6 lg:columns-8 gap-1 space-y-1";
    } else if (size === 'medium') {
        gallery_sshihabb007.className = "columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-2 space-y-2";
    } else if (size === 'large') {
        gallery_sshihabb007.className = "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4";
    }
}

// 4. Sort Controls
sortFilter_sshihabb007.addEventListener('change', renderGallery_sshihabb007);

// 5. Lightbox & Zoom Features
window.openLightbox_sshihabb007 = function(hdSrc) {
    lightboxImg_sshihabb007.src = hdSrc;
    lightbox_sshihabb007.classList.add('active');
    lightboxImg_sshihabb007.classList.remove('zoomed'); // reset zoom
}

// Close when clicking outside image or X button
lightbox_sshihabb007.addEventListener('click', (e) => {
    if (e.target === lightbox_sshihabb007 || e.target === closeLightbox_sshihabb007 || closeLightbox_sshihabb007.contains(e.target)) {
        lightbox_sshihabb007.classList.remove('active');
    }
});

// Zoom on click logic
lightboxImg_sshihabb007.addEventListener('click', () => {
    lightboxImg_sshihabb007.classList.toggle('zoomed');
});

// Move zoomed image with mouse
lightbox_sshihabb007.addEventListener('mousemove', (e) => {
    if(lightboxImg_sshihabb007.classList.contains('zoomed')) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        lightboxImg_sshihabb007.style.transformOrigin = `${x}% ${y}%`;
    }
});
lightboxImg_sshihabb007.addEventListener('mouseleave', () => {
    lightboxImg_sshihabb007.style.transformOrigin = `center center`;
});


// 6. Theme Logic
themeToggle_sshihabb007.onclick = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
};
if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.remove('dark');
}

// Start
initGallery_sshihabb007();
