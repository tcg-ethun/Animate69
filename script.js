// Add this function at the top of your script
function preloadImages(images, start, count) {
    const preloadArray = images.slice(start, start + count);
    return Promise.all(preloadArray.map(imageData => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(imageData);
            img.onerror = () => {
                console.warn(`Failed to load image: ${imageData.src}`);
                resolve(imageData); // Resolve anyway to not block other images
            };
            img.src = imageData.src;
        });
    }));
}

// Add loading tracker class
class LoadingTracker {
    constructor() {
        this.totalImages = 0;
        this.loadedImages = 0;
        this.loadingIndicator = document.getElementById('loading');
    }

    reset() {
        this.totalImages = 0;
        this.loadedImages = 0;
        this.showLoading();
    }

    addImage() {
        this.totalImages++;
    }

    imageLoaded() {
        this.loadedImages++;
        this.updateProgress();
    }

    updateProgress() {
        const progress = (this.loadedImages / this.totalImages) * 100;
        if (this.loadedImages >= this.totalImages) {
            this.hideLoading();
        }
    }

    showLoading() {
        this.loadingIndicator.style.display = 'flex';
        this.loadingIndicator.style.opacity = '1';
    }

    hideLoading() {
        this.loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            this.loadingIndicator.style.display = 'none';
        }, 300);
    }
}

// Add this class for managing image loading queue
class ImageLoadQueue {
    constructor(concurrency = 4) {
        this.queue = [];
        this.running = 0;
        this.concurrency = concurrency;
    }

    add(imageData) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                imageData,
                resolve,
                reject
            });
            this.processNext();
        });
    }

    async processNext() {
        if (this.running >= this.concurrency || this.queue.length === 0) return;

        this.running++;
        const { imageData, resolve, reject } = this.queue.shift();

        try {
            const img = new Image();
            await new Promise((res, rej) => {
                img.onload = res;
                img.onerror = rej;
                img.src = imageData.src;
            });
            resolve(imageData);
        } catch (err) {
            reject(err);
        } finally {
            this.running--;
            this.processNext();
        }
    }
}

// Add this utility function for image optimization
const imageOptimizer = {
    getOptimizedSrc(src, width = 800) {
        // Check if browser supports modern image formats
        const supportsWebP = document.querySelector('html').classList.contains('webp');
        
        // If original is already WebP, return as is
        if (src.endsWith('.webp')) return src;
        
        // For other formats, try to use WebP if supported
        if (supportsWebP) {
            return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        
        return src;
    },

    // Add support check for WebP
    checkWebPSupport() {
        const elem = document.createElement('canvas');
        if (elem.getContext && elem.getContext('2d')) {
            return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        }
        return false;
    }
};

// Check WebP support on load
document.addEventListener('DOMContentLoaded', () => {
    if (imageOptimizer.checkWebPSupport()) {
        document.querySelector('html').classList.add('webp');
    }
});

// Initialize the queue
const imageQueue = new ImageLoadQueue(4);

// Update image categories array to include 'fruit'
const imageCategories = ['fruit', 'cartoon' ,'nature', 'creative', 'tech', 'flower','food'];

const categoryLabels = {
    all: 'All Photos',
    cartoon: 'Cartoon',
    creative: 'Creative',
    flower: 'Flowers',
    nature: 'Nature',
    tech: 'Technology',
    fruit: 'Fruits',
    food: 'Foods',
};

// Add category icons mapping
const categoryIcons = {
    all: 'fa-images',
    creative: 'creative',
    cartoon: 'cartoon',
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

// Add at the top with other constants
const loadingTracker = new LoadingTracker();

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

// Update renderGallery function
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
                <button class="reset-filter" onclick="resetFilter()">Show all images</button>
            </div>
        `;
        updateLoadMoreButton(images);
        return;
    }

    const startIndex = append ? currentLoadedItems - LOAD_MORE_COUNT : 0;
    const itemsToRender = images.slice(startIndex, currentLoadedItems);

    itemsToRender.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in';
        
        galleryItem.innerHTML = `
            <div class="image-container">
                <div class="skeleton-loader"></div>
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                     data-src="${image.src}"
                     class="gallery-image"
                     alt="${image.category}">
            </div>
        `;

        const img = galleryItem.querySelector('img');
        const skeleton = galleryItem.querySelector('.skeleton-loader');

        // Create a new image object to preload
        const preloader = new Image();
        preloader.onload = () => {
            img.src = image.src;
            img.classList.add('loaded');
            skeleton.style.display = 'none';
        };
        preloader.src = image.src;

        // Add click event for preview
        galleryItem.addEventListener('click', () => {
            openModal(images, startIndex + index);
        });

        galleryContainer.appendChild(galleryItem);
    });

    updateLoadMoreButton(images);
}

// Add function to handle load more button
function updateLoadMoreButton(images) {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const loadMoreButton = loadMoreBtn.querySelector('.load-more');
    
    if (!loadMoreBtn) return;

    const remaining = images.length - currentLoadedItems;
    
    if (remaining > 0) {
        loadMoreBtn.style.display = 'flex';
        
        if (!loadMoreBtn.hasAttribute('data-listener')) {
            loadMoreBtn.setAttribute('data-listener', 'true');
            loadMoreButton.addEventListener('click', async () => {
                loadMoreButton.classList.add('loading');
                currentLoadedItems += LOAD_MORE_COUNT;
                
                await new Promise(resolve => setTimeout(resolve, 500));
                await renderGallery(images, true);
                
                loadMoreButton.classList.remove('loading');
            });
        }
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

// Add preview functionality
function openModal(images, index) {
    const modal = document.getElementById('modal');
    currentIndex = index;
    
    // Add active class to start animations
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    updateModalContent(images[currentIndex]);
}

function closeModal() {
    const modal = document.getElementById('modal');
    
    // Add closing animation
    modal.classList.remove('active');
    modal.classList.add('closing');
    
    // Remove modal after animation
    setTimeout(() => {
        modal.classList.remove('closing');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function updateModalContent(image) {
    modalImage.src = image.src;
    modalTitle.textContent = image.category;
    modalDescription.textContent = image.description || '';
}

function updateNavigationButtons(images) {
    prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
    nextBtn.style.display = currentIndex === images.length - 1 ? 'none' : 'block';
}

// Add these functions for modal navigation
document.addEventListener('DOMContentLoaded', () => {
    const modalClose = document.getElementById('modal-close');
    
    modalClose.addEventListener('click', closeModal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateModalContent(filteredImages[currentIndex]);
            updateNavigationButtons(filteredImages);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < filteredImages.length - 1) {
            currentIndex++;
            updateModalContent(filteredImages[currentIndex]);
            updateNavigationButtons(filteredImages);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                prevBtn.click();
            } else if (e.key === 'ArrowRight' && currentIndex < filteredImages.length - 1) {
                nextBtn.click();
            }
        }
    });
});

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
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterGallery(btn.dataset.filter);
    });
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

// Add button interaction handlers
function handleDownload(button, imageSrc) {
    button.classList.add('loading');
    button.innerHTML = '<i class="fas fa-spinner"></i> Downloading...';

    // Simulate download process
    setTimeout(() => {
        downloadImage(imageSrc).then(() => {
            button.classList.remove('loading');
            button.classList.add('success');
            button.innerHTML = '<i class="fas fa-check"></i> Downloaded';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                button.classList.remove('success');
                button.innerHTML = '<i class="fas fa-download"></i> Download';
            }, 2000);
        }).catch(() => {
            button.classList.remove('loading');
            button.innerHTML = '<i class="fas fa-download"></i> Download';
            showNotification('Download failed. Please try again.', 'error');
        });
    }, 800);
}

function handleShare(button, imageSrc, title) {
    button.classList.add('loading');
    button.innerHTML = '<i class="fas fa-spinner"></i> Sharing...';

    // Share process
    setTimeout(() => {
        shareImage(imageSrc, title).then(() => {
            button.classList.remove('loading');
            button.innerHTML = '<i class="fas fa-share-alt"></i> Share';
            showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            button.classList.remove('loading');
            button.innerHTML = '<i class="fas fa-share-alt"></i> Share';
            showNotification('Sharing failed. Please try again.', 'error');
        });
    }, 500);
}

// Add notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Error handling for images
function handleImageError(img) {
    const container = img.closest('.image-container');
    if (container) {
        const skeleton = container.querySelector('.skeleton-loader');
        if (skeleton) {
            skeleton.style.background = '#f8d7da'; // Error state background
        }
    }
    img.src = './Photo/error-placeholder.png'; // Replace with your error image
    img.classList.add('loaded');
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