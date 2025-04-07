
// Sample image data
const imageData = [
    {
        id: 1,
        src: "./pic5.png",
        title: "Mountain Sunrise",
        description: "Beautiful sunrise over the mountains",
        category: "nature"
    },
    {
        id: 2,
        src: "./pic6.png",
        title: "Urban Skyline",
        description: "City skyline at dusk",
        category: "city"
    },
    {
        id: 3,
        src: "./pic7.png",
        title: "Ocean Waves",
        description: "Crashing waves at sunset",
        category: "nature"
    },
    {
        id: 4,
        src: "./pic8.png",
        title: "Street Photography",
        description: "Urban life in black and white",
        category: "city"
    },
    {
        id: 5,
        src: "./pic7.png",
        title: "Portrait Study",
        description: "Artistic portrait photography",
        category: "people"
    },
    {
        id: 6,
        src: "./pic7.png",
        title: "Abstract Lights",
        description: "Colorful light painting",
        category: "abstract"
    },
    {
        id: 7,
        src: "./pic7.png",
        title: "Forest Path",
        description: "Pathway through a misty forest",
        category: "nature"
    },
    {
        id: 8,
        src: "./pic7.png",
        title: "Urban Architecture",
        description: "Modern architectural detail",
        category: "city"
    }
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
const uploadArea = document.getElementById('upload-area');
const uploadInput = document.getElementById('upload-input');
const header = document.getElementById('header');
const loadingIndicator = document.getElementById('loading');

// Current image index for modal
let currentIndex = 0;
let filteredImages = [...imageData];

// Initialize the gallery with images
function initGallery() {
    loadingIndicator.style.display = 'flex';
    
    setTimeout(() => {
        renderGallery(imageData);
        loadingIndicator.style.display = 'none';
    }, 600); // Simulate loading
}

// Render gallery items
function renderGallery(images) {
    galleryContainer.innerHTML = '';
    
    if (images.length === 0) {
        galleryContainer.innerHTML = '<p class="no-images">No images found for this filter.</p>';
        return;
    }
    
    images.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in';
        galleryItem.dataset.category = image.category;
        galleryItem.style.animationDelay = `${index * 50}ms`;
        
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.title}">
            <div class="overlay">
                <h3 class="title">${image.title}</h3>
                <p class="description">${image.description}</p>
            </div>
        `;
        
        galleryItem.addEventListener('click', () => openModal(images, index));
        galleryContainer.appendChild(galleryItem);
    });
}

// Open modal with image
function openModal(images, index) {
    currentIndex = index;
    filteredImages = images;
    
    updateModalContent();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Update modal content based on current index
function updateModalContent() {
    const image = filteredImages[currentIndex];
    modalImage.src = image.src;
    modalTitle.textContent = image.title;
    modalDescription.textContent = image.description;
}

// Navigate to previous image
function prevImage() {
    currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    updateModalContent();
}

// Navigate to next image
function nextImage() {
    currentIndex = (currentIndex + 1) % filteredImages.length;
    updateModalContent();
}

// Filter gallery items
function filterGallery(category) {
    let filtered;
    
    if (category === 'all') {
        filtered = imageData;
    } else {
        filtered = imageData.filter(image => image.category === category);
    }
    
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

// Upload functionality
function handleUpload(files) {
    if (!files || files.length === 0) return;
    
    loadingIndicator.style.display = 'flex';
    
    // Simulate upload process
    setTimeout(() => {
        const newImages = Array.from(files).map((file, index) => {
            // Create object URL for preview
            const src = URL.createObjectURL(file);
            return {
                id: imageData.length + index + 1,
                src: src,
                title: file.name.split('.')[0],
                description: `Uploaded image ${index + 1}`,
                category: 'abstract' // Default category
            };
        });
        
        // Add new images to the data array
        imageData.unshift(...newImages);
        
        // Reset filter to show all images including new ones
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });
        
        // Rerender gallery
        renderGallery(imageData);
        loadingIndicator.style.display = 'none';
    }, 1500);
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

uploadArea.addEventListener('click', () => {
    uploadInput.click();
});

uploadInput.addEventListener('change', (e) => {
    handleUpload(e.target.files);
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleUpload(e.dataTransfer.files);
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
document.addEventListener('DOMContentLoaded', initGallery);

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

// Initial call to setup
initGallery();