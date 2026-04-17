const gallery_sshihabb007 = document.getElementById('gallery');
const themeToggle_sshihabb007 = document.getElementById('themeToggle');

// 1. Fetch and Display Photos
async function initGallery_sshihabb007() {
    try {
        // LOCAL AUTOMATION FIX: Trigger PHP script if on XAMPP to rebuild photos.json dynamically
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            try {
                await fetch('generate.php?t=' + Date.now());
            } catch(e) { console.error('Local PHP generator failed:', e); }
        }

        // Added '?t=' bypass to prevent browsers from caching the old photos.json
        const response_sshihabb007 = await fetch('photos.json?t=' + Date.now());
        if (!response_sshihabb007.ok) throw new Error("JSON not found. Upload photos first!");
        
        const photos_sshihabb007 = await response_sshihabb007.json();
        
        // Remove loader
        gallery_sshihabb007.innerHTML = '';

        if (photos_sshihabb007.length === 0) {
            gallery_sshihabb007.innerHTML = '<p class="col-span-full text-center">No photos found in UPLOAD folder.</p>';
            return;
        }

        // Render images (They are already sorted by the GitHub Action)
        photos_sshihabb007.forEach(photo_sshihabb007 => {
            const card_sshihabb007 = `
                <div class="break-inside-avoid group relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                    <img 
                        src="${photo_sshihabb007.url}" 
                        loading="lazy" 
                        alt="Model Photography"
                        class="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                    />
                    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p class="text-white text-xs font-mono">Uploaded: ${new Date(photo_sshihabb007.timestamp * 1000).toLocaleDateString()}</p>
                    </div>
                </div>
            `;
            gallery_sshihabb007.innerHTML += card_sshihabb007;
        });
    } catch (err_sshihabb007) {
        console.error(err_sshihabb007);
        gallery_sshihabb007.innerHTML = `<p class="text-red-500">Error loading images. Make sure the UPLOAD folder has images and the GitHub Action has run.</p>`;
    }
}

// 2. Dark Mode Toggle Logic
themeToggle_sshihabb007.onclick = () => {
    document.documentElement.classList.toggle('dark');
    const isDark_sshihabb007 = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark_sshihabb007 ? 'dark' : 'light');
};

// Apply saved theme on load
if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.remove('dark');
}

initGallery_sshihabb007();
