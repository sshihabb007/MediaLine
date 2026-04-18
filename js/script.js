const gallery_sshihabb007 = document.getElementById('gallery');
const themeToggle_sshihabb007 = document.getElementById('themeToggle');
const sortFilter_sshihabb007 = document.getElementById('sortFilter');
const lightbox_sshihabb007 = document.getElementById('lightbox');
const lightboxImg_sshihabb007 = document.getElementById('lightboxImg');
const closeLightbox_sshihabb007 = document.getElementById('closeLightbox');
const photoCount_sshihabb007 = document.getElementById('photoCount');
const columnSlider_sshihabb007 = document.getElementById('columnSlider_sshihabb007');
const colCountDisplay_sshihabb007 = document.getElementById('colCountDisplay');
const dateFilter_sshihabb007 = document.getElementById('dateFilter_sshihabb007');

let allPhotos_sshihabb007 = [];

const gridClasses_sshihabb007 = {
    1: 'columns-1 gap-4 space-y-4',
    2: 'columns-1 sm:columns-2 gap-4 space-y-4',
    3: 'columns-2 sm:columns-3 gap-4 space-y-4',
    4: 'columns-2 sm:columns-3 md:columns-4 gap-2 space-y-2',
    5: 'columns-3 sm:columns-4 lg:columns-5 gap-2 space-y-2',
    6: 'columns-3 sm:columns-4 md:columns-5 lg:columns-6 gap-2 space-y-2',
    7: 'columns-3 sm:columns-5 md:columns-6 lg:columns-7 gap-2 space-y-2',
    8: 'columns-4 sm:columns-6 md:columns-7 lg:columns-8 gap-1 space-y-1',
    9: 'columns-4 sm:columns-6 md:columns-8 lg:columns-9 gap-1 space-y-1',
   10: 'columns-5 sm:columns-7 md:columns-9 lg:columns-10 gap-1 space-y-1'
};

let currentGridClass_sshihabb007 = gridClasses_sshihabb007[6];

// 1. Fetch, Setup, and Render
async function initGallery_sshihabb007() {
    try {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            try { await fetch('generate.php?t=' + Date.now()); } catch(e) { }
        }

        const response_sshihabb007 = await fetch('photos.json?t=' + Date.now());
        if (!response_sshihabb007.ok) throw new Error("JSON not found. Upload photos first!");
        
        allPhotos_sshihabb007 = await response_sshihabb007.json();
        
        if (allPhotos_sshihabb007.length === 0) {
            gallery_sshihabb007.innerHTML = '<p class="text-center py-20">No photos found in UPLOAD folder.</p>';
            return;
        }

        renderGallery_sshihabb007();
    } catch (err_sshihabb007) {
        console.error(err_sshihabb007);
        gallery_sshihabb007.innerHTML = `<p class="text-red-500 text-center py-20">Error loading images.</p>`;
    }
}

// 2. Main Render Logic
function renderGallery_sshihabb007() {
    gallery_sshihabb007.innerHTML = '';
    
    // Apply Sort filter
    const sortVal = sortFilter_sshihabb007.value;
    const selectedDateStr = dateFilter_sshihabb007 ? dateFilter_sshihabb007.value : '';
    
    let filteredPhotos_sshihabb007 = [...allPhotos_sshihabb007];
    const nowTime = Math.floor(Date.now() / 1000);
    const day = 86400;

    if (selectedDateStr) {
        filteredPhotos_sshihabb007 = filteredPhotos_sshihabb007.filter(p => {
             const d = new Date(p.timestamp * 1000);
             const y = d.getFullYear();
             const m = String(d.getMonth() + 1).padStart(2, '0');
             const dayStr = String(d.getDate()).padStart(2, '0');
             const pDateStr = `${y}-${m}-${dayStr}`;
             return pDateStr === selectedDateStr;
        });
    } else {
        if (sortVal === 'today') {
            filteredPhotos_sshihabb007 = filteredPhotos_sshihabb007.filter(p => (nowTime - p.timestamp) <= day);
        } else if (sortVal === '1week') {
            filteredPhotos_sshihabb007 = filteredPhotos_sshihabb007.filter(p => (nowTime - p.timestamp) <= day * 7);
        } else if (sortVal === '1month') {
            filteredPhotos_sshihabb007 = filteredPhotos_sshihabb007.filter(p => (nowTime - p.timestamp) <= day * 30);
        } else if (sortVal === '2months') {
            filteredPhotos_sshihabb007 = filteredPhotos_sshihabb007.filter(p => (nowTime - p.timestamp) <= day * 60);
        } else if (sortVal === '3months') {
            filteredPhotos_sshihabb007 = filteredPhotos_sshihabb007.filter(p => (nowTime - p.timestamp) <= day * 90);
        }
    }

    filteredPhotos_sshihabb007.sort((a, b) => {
        return sortVal === 'oldest' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
    });

    // Update Photo Count dynamically
    if (photoCount_sshihabb007) {
        photoCount_sshihabb007.innerText = filteredPhotos_sshihabb007.length;
        photoCount_sshihabb007.classList.remove('hidden');
    }

    if (filteredPhotos_sshihabb007.length === 0) {
        gallery_sshihabb007.innerHTML = '<p class="text-center py-20 opacity-50">No photos match this filter.</p>';
        return;
    }

    // Group photos by Date
    const groupedPhotos_sshihabb007 = {};
    filteredPhotos_sshihabb007.forEach(photo_sshihabb007 => {
        const dateObj_sshihabb007 = new Date(photo_sshihabb007.timestamp * 1000);
        const dateStr_sshihabb007 = dateObj_sshihabb007.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        if (!groupedPhotos_sshihabb007[dateStr_sshihabb007]) {
            groupedPhotos_sshihabb007[dateStr_sshihabb007] = [];
        }
        groupedPhotos_sshihabb007[dateStr_sshihabb007].push(photo_sshihabb007);
    });

    // Render each date group
    for (const [dateStr_sshihabb007, photos_sshihabb007] of Object.entries(groupedPhotos_sshihabb007)) {
        let groupHTML_sshihabb007 = `
        <div class="mb-4">
            <h2 class="text-xs md:text-sm font-semibold mb-2 border-b border-zinc-200 dark:border-zinc-800 pb-1 flex items-center justify-between">
                <span>${dateStr_sshihabb007}</span>
                <span class="text-[10px] md:text-xs font-normal text-zinc-500">${photos_sshihabb007.length}</span>
            </h2>
            <div class="gallery-group ${currentGridClass_sshihabb007}">
        `;
        
        photos_sshihabb007.forEach(photo_sshihabb007 => {
            const encodePath = (path) => path.split('/').map(encodeURIComponent).join('/');
            const imgSrc_sshihabb007 = encodePath(photo_sshihabb007.thumb_url || photo_sshihabb007.url);
            const hdSrc_sshihabb007 = encodePath(photo_sshihabb007.url);
            const tightGap = currentGridClass_sshihabb007.includes('gap-1');

            groupHTML_sshihabb007 += `
                <div class="break-inside-avoid ${tightGap ? 'mb-1' : 'mb-2 md:mb-4'} group relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 cursor-pointer" onclick="openLightbox_sshihabb007('${hdSrc_sshihabb007}')">
                    <img 
                        src="${imgSrc_sshihabb007}" 
                        onerror="this.onerror=null; this.src='${hdSrc_sshihabb007}';"
                        loading="lazy" 
                        alt="Gallery Upload"
                        class="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                    />
                </div>
            `;
        });
        
        groupHTML_sshihabb007 += `</div></div>`;
        gallery_sshihabb007.innerHTML += groupHTML_sshihabb007;
    }
}

// 3. Grid Controls (Slider)
if (columnSlider_sshihabb007) {
    columnSlider_sshihabb007.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (colCountDisplay_sshihabb007) colCountDisplay_sshihabb007.innerText = val;
        currentGridClass_sshihabb007 = gridClasses_sshihabb007[val];
        
        // Apply instantly to DOM
        document.querySelectorAll('.gallery-group').forEach(el => {
            el.className = `gallery-group ${currentGridClass_sshihabb007}`;
            
            // Fix bottom margin gaps based on scale
            Array.from(el.children).forEach(child => {
                if(val >= 8) {
                    child.classList.remove('mb-2', 'md:mb-4');
                    child.classList.add('mb-1');
                } else {
                    child.classList.remove('mb-1');
                    child.classList.add('mb-2', 'md:mb-4');
                }
            });
        });
    });
}

// 4. Sort Controls
sortFilter_sshihabb007.addEventListener('change', () => {
    if (dateFilter_sshihabb007) dateFilter_sshihabb007.value = ''; // clear explicit date logic
    renderGallery_sshihabb007();
});

if (dateFilter_sshihabb007) {
    dateFilter_sshihabb007.addEventListener('change', () => {
        if(dateFilter_sshihabb007.value) sortFilter_sshihabb007.value = 'newest'; // reset sort logic fallback
        renderGallery_sshihabb007();
    });
}

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
