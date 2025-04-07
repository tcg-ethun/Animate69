// Update image categories array to include 'fruit'
const imageCategories = ['fruit', 'nature', 'tech', 'flower','food'];

const imageData = [
    { src: "./Photo/pic7.jpg", category: "nature" },
    { src: "./Photo/pic8.jpg", category: "nature" },
    { src: "./Photo/pic7.jpg", category: "nature" },
    { src: "./Photo/pic8.jpg", category: "nature" },
    { src: "./Photo/pic8.png", category: "nature" },
    { src: "./Photo/pic3.jpg", category: "nature" },
    { src: "./Photo/15.jpg", category: "nature" },
    { src: "./Photo/16.jpg", category: "nature" },
    { src: "./Photo/17.jpg", category: "nature" },
    { src: "./Photo/18.jpg", category: "nature" },
    { src: "./Photo/19.jpg", category: "nature" },
    { src: "./Photo/20.jpg", category: "nature" },
    { src: "./Photo/21.jpg", category: "nature" },
    { src: "./Photo/22.jpg", category: "nature" },
    { src: "./Photo/23.jpg", category: "nature" },
    { src: "./Photo/27.jpg", category: "nature" },
    { src: "./Photo/28.jpg", category: "nature" },
    { src: "./Photo/29.jpg", category: "nature" },
    { src: "./Photo/30.jpg", category: "nature" },
    { src: "./Photo/31.jpg", category: "nature" },
    { src: "./Photo/32.jpg", category: "nature" },


    { src: "./Photo/1.jpg", category: "fruit" },
    { src: "./Photo/2.jpg", category: "fruit" },
    { src: "./Photo/3.jpg", category: "fruit" },
    { src: "./Photo/4.jpg", category: "fruit" },
    { src: "./Photo/5.jpg", category: "fruit" },
    { src: "./Photo/6.jpg", category: "fruit" },
    { src: "./Photo/7.jpg", category: "fruit" },
    { src: "./Photo/8.jpg", category: "fruit" },
    { src: "./Photo/9.jpg", category: "fruit" },
    { src: "./Photo/10.jpg", category: "fruit" },
    { src: "./Photo/11.jpg", category: "fruit" },
    { src: "./Photo/12.jpg", category: "fruit" },
    { src: "./Photo/13.jpg", category: "fruit" },
    { src: "./Photo/14.jpg", category: "fruit" },

    { src: "./Photo/25.jpg", category: "tech" },
    { src: "./Photo/26.jpg", category: "tech" },
 
    { src: "./Photo/pic5.jpg", category: "flower" },
    { src: "./Photo/pic6.jpg", category: "flower" },
    { src: "./Photo/pic6.jpg", category: "flower" },
    { src: "./Photo/pic6.jpg", category: "flower" },





];

const categoryLabels = {
    all: 'All Photos',
    flower: 'Flowers',
    nature: 'Nature',
    tech: 'Technology',
    fruit: 'Fruits',
    food: 'Foods',
};

// Add category icons mapping
const categoryIcons = {
    all: 'fa-images',
    flower: 'fa-fan',
    nature: 'fa-leaf',
    tech: 'fa-microchip',
    fruit: 'fa-apple-alt',
    food: 'fa-utensils'
};

// Add this function after imageData declaration
function getCategoryCounts() {
    const counts = {
        all: imageData.length
    };
    
    imageCategories.forEach(category => {
        counts[category] = imageData.filter(img => img.category === category).length;
    });
    
    return counts;
}

// Update getRandomImages function for better randomization
function getRandomImages() {
    const shuffled = imageData.reduce((shuffledArray, currentItem) => {
        const randomPosition = Math.floor(Math.random() * (shuffledArray.length + 1));
        shuffledArray.splice(randomPosition, 0, currentItem);
        return shuffledArray;
    }, []);
    
    return shuffled;
}

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
let currentCategory = localStorage.getItem('currentCategory') || 'all';

// Current image index for modal
let currentIndex = 0;
let filteredImages = [...imageData];

// Add zoom functionality
let currentZoom = 1;
const zoomLevels = [1, 1.5, 2, 2.5, 3];
let currentZoomIndex = 0;

// Add at the top with your other constants
const RECENT_DAYS = 7; // Show images added within last 7 days

// Add these variables at the top with other constants
const ITEMS_PER_PAGE = 25;
const LOAD_MORE_COUNT = 25;
let currentLoadedItems = ITEMS_PER_PAGE;

// Add global variables
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Update the loading indicator HTML
function updateLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.innerHTML = `
        <div class="loader"></div>
        <div class="loading-text"> </div>
    `;
}

// Update the initialization function
async function initGallery() {
    updateLoadingIndicator();
    loadingIndicator.style.display = 'flex';
    
    try {
        // Randomize images on each initialization
        filteredImages = getRandomImages();
        
        // Add a minimum loading time to prevent flickering
        await Promise.all([
            new Promise(resolve => setTimeout(resolve, 800)),
            renderGallery(filteredImages)
        ]);
    } finally {
        loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            loadingIndicator.style.opacity = '1';
        }, 300);
    }
}

// Update renderGallery function to handle pagination
function renderGallery(images, append = false) {
    if (!append) {
        galleryContainer.innerHTML = '';
        currentLoadedItems = ITEMS_PER_PAGE;
    }
    
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
        updateLoadMoreButton(images);
        return;
    }
    
    const itemsToRender = images.slice(
        append ? currentLoadedItems - LOAD_MORE_COUNT : 0,
        currentLoadedItems
    );
    
    itemsToRender.forEach((image, index) => {
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
            handleImageError(img);
        };
        
        galleryContainer.appendChild(galleryItem);
    });
    
    updateLoadMoreButton(images);
}

// Add function to handle load more button
function updateLoadMoreButton(images) {
    let loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (!loadMoreBtn) {
        loadMoreBtn = document.createElement('div');
        loadMoreBtn.className = 'load-more-btn';
        document.querySelector('.gallery-container').after(loadMoreBtn);
    }
    
    if (currentLoadedItems < images.length) {
        loadMoreBtn.innerHTML = `
            <button class="load-more">
                Load More <span>(${images.length - currentLoadedItems} more)</span>
            </button>
        `;
        loadMoreBtn.style.display = 'flex';
        
        loadMoreBtn.querySelector('button').addEventListener('click', () => {
            currentLoadedItems += LOAD_MORE_COUNT;
            renderGallery(images, true);
        });
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Add reset filter function
function resetFilter() {
    // Clear saved category
    localStorage.setItem('currentCategory', 'all');
    currentCategory = 'all';
    
    const allFilterBtn = document.querySelector('[data-filter="all"]');
    if (allFilterBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        allFilterBtn.classList.add('active');
        filterGallery('all');
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
                onerror="handleImageError(this);"
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

// Update filterGallery function
function filterGallery(category) {
    // Store category in localStorage
    localStorage.setItem('currentCategory', category);
    currentCategory = category;
    
    // Filter images without randomizing first
    let filtered = category === 'all' 
        ? [...imageData]
        : imageData.filter(img => img.category === category);
    
    // Then randomize the filtered results
    filtered = filtered.reduce((shuffledArray, currentItem) => {
        const randomPosition = Math.floor(Math.random() * (shuffledArray.length + 1));
        shuffledArray.splice(randomPosition, 0, currentItem);
        return shuffledArray;
    }, []);
    
    filteredImages = filtered;
    currentLoadedItems = ITEMS_PER_PAGE;
    
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

// Update renderFilterButtons function
function renderFilterButtons() {
    const filterContainer = document.querySelector('.filter-section');
    const counts = getCategoryCounts();
    const savedCategory = localStorage.getItem('currentCategory') || 'all';
    
    filterContainer.innerHTML = `
        <button class="all-photos-btn" data-filter="${savedCategory}">
            ${categoryLabels[savedCategory]} <span class="category-count">(${counts[savedCategory]})</span>
        </button>
        <button class="show-all-categories">
            <i class="fas fa-th-large"></i>
            View All Categories
        </button>
    `;
    
    // Update event listener for all-photos-btn
    const allPhotosBtn = filterContainer.querySelector('.all-photos-btn');
    allPhotosBtn.addEventListener('click', () => {
        // Filter by the current category stored in data-filter
        const currentFilter = allPhotosBtn.dataset.filter;
        filterGallery(currentFilter);
    });
    
    initCategoryPopup();
}

// Add popup functionality
function initCategoryPopup() {
    const showAllBtn = document.querySelector('.show-all-categories');
    const popup = document.getElementById('categoryPopup');
    const closeBtn = popup.querySelector('.close-popup');
    const categoriesGrid = popup.querySelector('.categories-grid');
    
    // Populate categories
    function populateCategories() {
        const counts = getCategoryCounts();
        categoriesGrid.innerHTML = `
            <div class="category-card" data-category="all">
                <h4>${categoryLabels.all}</h4>
                <span class="category-count-badge">${counts.all}</span>
            </div>
            ${imageCategories.map(category => `
                <div class="category-card" data-category="${category}">
                    <h4>${categoryLabels[category]}</h4>
                    <span class="category-count-badge">${counts[category]}</span>
                </div>
            `).join('')}
        `;
        
        // Update click handlers for category cards
        categoriesGrid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                
                // Update localStorage and current category
                localStorage.setItem('currentCategory', category);
                currentCategory = category;
                
                // Update main filter button text and data-filter attribute
                const allPhotosBtn = document.querySelector('.all-photos-btn');
                allPhotosBtn.textContent = `${categoryLabels[category]} (${counts[category]})`;
                allPhotosBtn.dataset.filter = category;
                
                filterGallery(category);
                closePopup();
            });
        });
    }
    
    function openPopup() {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        populateCategories();
    }
    
    function closePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    showAllBtn.addEventListener('click', openPopup);
    closeBtn.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });
}

// Add settings functionality
function initSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPopup = document.getElementById('settingsPopup');
    const closeSettings = document.querySelector('.close-settings');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const viewButtons = document.querySelectorAll('.view-option-btn');
    
    // Initialize dark mode
    darkModeToggle.checked = isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    // Initialize view buttons
    viewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === currentView);
    });
    
    // Event listeners
    settingsBtn.addEventListener('click', () => {
        settingsPopup.classList.add('active');
    });
    
    closeSettings.addEventListener('click', () => {
        settingsPopup.classList.remove('active');
    });
    
    // Dark mode toggle
    darkModeToggle.addEventListener('change', (e) => {
        isDarkMode = e.target.checked;
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // View options
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            currentView = view;
            localStorage.setItem('galleryView', view);
            
            // Update active states
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update gallery view
            updateGalleryView(view);
        });
    });
    
    // Close on outside click
    settingsPopup.addEventListener('click', (e) => {
        if (e.target === settingsPopup) {
            settingsPopup.classList.remove('active');
        }
    });
}

// Add function to update gallery view
function updateGalleryView(view) {
    const galleryContainer = document.getElementById('gallery-container');
    galleryContainer.className = `gallery-container ${view}-view`;
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

// Update DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    renderFilterButtons();
    
    // Get saved category
    const savedCategory = localStorage.getItem('currentCategory') || 'all';
    const counts = getCategoryCounts();
    
    // Update main filter button text
    const allPhotosBtn = document.querySelector('.all-photos-btn');
    allPhotosBtn.textContent = `${categoryLabels[savedCategory]} (${counts[savedCategory]})`;
    
    // Apply the saved category filter directly
    filterGallery(savedCategory);
    
    initViewSwitcher();
    renderRecentImages();
    initCategoryPopup();
    initSettings();
    initSlideshow();
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

// Error handling for images
function handleImageError(img) {
    img.onerror = null;
    img.src = './Photo/loading.png';
}

// Add slideshow functionality
function initSlideshow() {
    const track = document.querySelector('.slideshow-track');
    let usedIndexes = new Set();
    let slideInterval;
    let isAnimating = false;

    function getRandomIndex(images) {
        // Reset used indexes if all images have been shown
        if (usedIndexes.size >= images.length) {
            usedIndexes.clear();
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * images.length);
        } while (usedIndexes.has(randomIndex));

        usedIndexes.add(randomIndex);
        return randomIndex;
    }

    function updateSlide() {
        if (isAnimating) return;
        isAnimating = true;

        const currentSlide = track.querySelector('.slide-item.active');
        const currentCategory = localStorage.getItem('currentCategory') || 'all';
        const images = currentCategory === 'all' ? 
            imageData : 
            imageData.filter(img => img.category === currentCategory);

        // Get random image
        const randomIndex = getRandomIndex(images);
        const randomImage = images[randomIndex];

        // Create new slide
        const newSlide = document.createElement('div');
        newSlide.className = 'slide-item';
        newSlide.innerHTML = `
            <img src="${randomImage.src}" 
                 alt="${randomImage.category}" 
                 loading="lazy">
        `;

        // Add new slide to track
        track.appendChild(newSlide);

        // Trigger reflow
        newSlide.offsetHeight;

        // Start animation
        if (currentSlide) {
            currentSlide.classList.add('exit');
        }
        newSlide.classList.add('active');

        // Clean up after animation
        setTimeout(() => {
            if (currentSlide) {
                track.removeChild(currentSlide);
            }
            isAnimating = false;
        }, 800);
    }

    function startSlideshow() {
        if (slideInterval) clearInterval(slideInterval);
        updateSlide();
        slideInterval = setInterval(updateSlide, 3000);
    }

    // Initialize and start slideshow
    startSlideshow();

    // Event Listeners
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearInterval(slideInterval);
        updateSlide();
        startSlideshow();
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearInterval(slideInterval);
        updateSlide();
        startSlideshow();
    });

    track.addEventListener('mouseenter', () => clearInterval(slideInterval));
    track.addEventListener('mouseleave', startSlideshow);
}

// Initial call to setup
initGallery();
checkForNewImages();
initSlideshow();