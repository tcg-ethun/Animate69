// Update image data structure
const imageData = [
    {
        src: "./pic5.jpg",
        category: "flower"
    },
    {
        src: "./pic6.jpg",
        category: "flower"
    },
    {
        src: "./pic7.jpg",
        category: "nature"
    },
    {
        src: "./pic8.jpg",
        category: "nature"
    },
    {
        src: "./pic7.jpg",
        category: "nature"
    },
    {
        src: "./pic8.jpg",
        category: "nature"
    },
    {
        src: "./pic6.jpg",
        category: "flower"
    },
    {
        src: "./pic6.jpg",
        category: "flower"
    },
    {
        src: "./pic3.png",
        category: "tech"
    },
    {
        src: "./pic8.png",
        category: "nature"
    },
    // {
    //     src: "./pic9.png",
    //     category: "nature"
    // },
    // {
    //     src: "./pic5.png",
    //     category: "nature"
    // },
    {
        src: "./pic4.png",
        category: "tech"
    },
    {
        src: "./pic2.jpg",
        category: "tech"
    },
    {
        src: "./pic3.jpg",
        category: "nature"
    },
];

// DOM elements
const galleryContainer = document.getElementById('gallery-container');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalClose = document.getElementById('modal-close');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const header = document.getElementById('header');
const loadingIndicator = document.getElementById('loading');
const recentContainer = document.getElementById('recent-container');

// Add these variables at the top
let currentView = localStorage.getItem('galleryView') || 'grid';

// Current image index for modal
let currentIndex = 0;
let filteredImages = [...imageData];

// Add zoom functionality
let currentZoom = 1;
const zoomLevels = [1, 1.5, 2, 2.5, 3];
let currentZoomIndex = 0;

// Add at the top with your other constants
const RECENT_DAYS = 7; // Show images added within last 7 days

// Update the loading indicator HTML
function updateLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.innerHTML = `
        <div class="loader"></div>
        <div class="loading-text"> </div>
    `;
}

// Initialize the gallery with images
async function initGallery() {
    updateLoadingIndicator();
    loadingIndicator.style.display = 'flex';
    
    try {
        // Add a minimum loading time to prevent flickering
        await Promise.all([
            new Promise(resolve => setTimeout(resolve, 800)),
            renderGallery(imageData)
        ]);
    } finally {
        // Add fade out animation
        loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            loadingIndicator.style.opacity = '1';
        }, 300);
    }
}

// Update renderGallery function
function renderGallery(images) {
    galleryContainer.innerHTML = '';
    
    if (images.length === 0) {
        galleryContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No images found in this category</p>
                <button class="reset-filter" onclick="resetFilter()">
                    Show all images
                </button>
            </div>
        `;
        return;
    }
    
    images.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in';
        galleryItem.dataset.category = image.category;
        
        const img = new Image();
        img.src = image.src;
        
        img.onload = () => {
            galleryItem.innerHTML = `
                <div class="image-container">
                    <img src="${image.src}" 
                        alt="${image.category}"
                        loading="lazy"
                    >
                </div>
                <div class="gallery-actions">
                    <button class="action-btn download-btn" data-src="${image.src}">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn share-btn" data-src="${image.src}">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            `;
            
            galleryItem.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    openModal(images, index);
                }
            });
        };
        
        img.onerror = () => {
            galleryItem.innerHTML = `
                <div class="image-container">
                    <img src="./loading.png" 
                        alt="Image failed to load"
                        class="error-image"
                    >
                </div>
            `;
        };
        
        galleryContainer.appendChild(galleryItem);
    });
}

// Add reset filter function
function resetFilter() {
    const allFilterBtn = document.querySelector('[data-filter="all"]');
    if (allFilterBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        allFilterBtn.classList.add('active');
        renderGallery(imageData);
    }
}

// Open modal with image
function openModal(images, index) {
    currentIndex = index;
    filteredImages = images;
    modal.classList.add('active');
    currentZoom = 1;
    currentZoomIndex = 0;
    updateModal(images[index]);
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentZoom = 1;
    currentZoomIndex = 0;
}

// Update modal content
function updateModal(imageData) {
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
        <button class="modal-close" aria-label="Close modal">
            <i class="fas fa-times"></i>
        </button>
        <div class="modal-image-container">
            <img src="${imageData.src}" 
                alt="${imageData.category}"
                class="modal-image"
                style="transform: scale(${currentZoom})"
                onerror="this.onerror=null; this.src='./loading.png';"
            >
            <div class="zoom-controls">
                <button class="zoom-btn zoom-out" aria-label="Zoom out">
                    <i class="fas fa-search-minus"></i>
                </button>
                <button class="zoom-btn zoom-in" aria-label="Zoom in">
                    <i class="fas fa-search-plus"></i>
                </button>
            </div>
        </div>
        <div class="gallery-actions">
            <button class="action-btn download-btn" data-src="${imageData.src}">
                <i class="fas fa-download"></i> Download
            </button>
            <button class="action-btn share-btn" data-src="${imageData.src}">
                <i class="fas fa-share-alt"></i> Share
            </button>
        </div>
    `;

    // Add event listeners
    const closeBtn = modalContent.querySelector('.modal-close');
    const zoomIn = modalContent.querySelector('.zoom-in');
    const zoomOut = modalContent.querySelector('.zoom-out');
    const downloadBtn = modalContent.querySelector('.download-btn');
    const shareBtn = modalContent.querySelector('.share-btn');
    
    closeBtn.addEventListener('click', closeModal);
    zoomIn.addEventListener('click', handleZoomIn);
    zoomOut.addEventListener('click', handleZoomOut);
    downloadBtn.addEventListener('click', () => handleDownload(imageData.src));
    shareBtn.addEventListener('click', () => handleShare(imageData.src));
}

// Navigate to previous image
function prevImage() {
    currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    updateModal(filteredImages[currentIndex]);
}

// Navigate to next image
function nextImage() {
    currentIndex = (currentIndex + 1) % filteredImages.length;
    updateModal(filteredImages[currentIndex]);
}

// Filter gallery items
function filterGallery(category) {
    let filtered = category === 'all' ? imageData : imageData.filter(image => image.category === category);
    filteredImages = filtered;
    
    loadingIndicator.style.display = 'flex';
    setTimeout(() => {
        renderGallery(filtered);
        loadingIndicator.style.display = 'none';
    }, 300);
}

// Handle scroll for header
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Add view switching functionality
function initViewSwitcher() {
    const galleryContainer = document.getElementById('gallery-container');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Set initial view
    galleryContainer.className = `gallery-container ${currentView}-view`;
    viewButtons.forEach(btn => {
        if(btn.dataset.view === currentView) {
            btn.classList.add('active');
        }
    });

    // View switch handler
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            
            // Update buttons
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update container class
            galleryContainer.className = `gallery-container ${view}-view`;
            
            // Save to localStorage
            localStorage.setItem('galleryView', view);
            currentView = view;
            
            // Re-render gallery with new view
            renderGallery(filteredImages);
        });
    });
}

// Zoom functionality
function handleZoomIn() {
    if (currentZoomIndex < zoomLevels.length - 1) {
        currentZoomIndex++;
        currentZoom = zoomLevels[currentZoomIndex];
        updateZoom();
    }
}

function handleZoomOut() {
    if (currentZoomIndex > 0) {
        currentZoomIndex--;
        currentZoom = zoomLevels[currentZoomIndex];
        updateZoom();
    }
}

function updateZoom() {
    const modalImage = document.querySelector('.modal-image');
    modalImage.style.transform = `scale(${currentZoom})`;
}

// Add this function to check for recent images
function isRecent(image) {
    // Get the file's last modified date using its path
    const filePath = image.src;
    try {
        const stats = require('fs').statSync(filePath);
        const modifiedDate = new Date(stats.mtime);
        const daysAgo = (new Date() - modifiedDate) / (1000 * 60 * 60 * 24);
        return daysAgo <= RECENT_DAYS;
    } catch (error) {
        return false;
    }
}

// Add function to render recent images
function renderRecentImages() {
    const recentImages = imageData.filter(isRecent);

    if (recentImages.length === 0) {
        recentContainer.parentElement.style.display = 'none';
        return;
    }

    recentContainer.innerHTML = '';
    recentImages.forEach((image, index) => {
        const recentItem = document.createElement('div');
        recentItem.className = 'recent-item';
        recentItem.innerHTML = `
            <img src="${image.src}" alt="${image.category}">
            <span class="recent-badge">New</span>
        `;

        recentItem.addEventListener('click', () => {
            openModal(recentImages, index);
        });

        recentContainer.appendChild(recentItem);
    });
}

// Add function to check for new images periodically
function checkForNewImages() {
    const watchFolder = './'; // Your images folder path
    require('fs').watch(watchFolder, (eventType, filename) => {
        if (filename && filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
            // Update image data and re-render recent section
            updateImageData().then(() => {
                renderRecentImages();
            });
        }
    });
}

// Function to update image data
async function updateImageData() {
    // This is where you would update your imageData array
    // with any new images found in the directory
    // For now, we'll just re-render with existing data
    renderGallery(imageData);
}

// Event listeners
modalClose.addEventListener('click', closeModal);
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterGallery(btn.dataset.filter);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});

// Modal click outside to close
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Scroll event
window.addEventListener('scroll', handleScroll);

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initViewSwitcher();
    initGallery();
    renderRecentImages();
});

// Lazy loading implementation
const lazyLoad = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            observer.unobserve(img);
        }
    });
};

// Initialize lazy loading after gallery is populated
const setupLazyLoading = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(lazyLoad, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
};

// Download handler function
function handleDownload(imageSrc) {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = imageSrc.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Update share handler
async function handleShare(url) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Swift Gallery Image',
                text: 'Check out this image from Swift Gallery',
                url: window.location.origin + '/' + url
            });
        } catch (err) {
            console.log('Share failed:', err);
        }
    } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.origin + '/' + url;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showNotification('Link copied to clipboard!', 'success');
    }
}

// Add notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update event listeners
galleryContainer.addEventListener('click', (e) => {
    const target = e.target.closest('.action-btn');
    if (!target) return;

    e.stopPropagation(); // Prevent modal from opening when clicking buttons

    if (target.classList.contains('download-btn')) {
        handleDownload(target.dataset.src);
    } else if (target.classList.contains('share-btn')) {
        handleShare(target.dataset.src);
    }
});

// Initial call to setup
initGallery();
checkForNewImages();