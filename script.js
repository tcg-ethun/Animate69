document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.close-modal');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryTitle = document.querySelector('.category-title');
    const themeToggle = document.getElementById('theme-toggle');
    const photoCountDisplay = document.createElement('span'); // For photo count display in category title
    
    categoryTitle.appendChild(photoCountDisplay); // Append photo count to the category title
    
    // Set theme based on localStorage or default to light
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    // Update the theme toggle icon based on current theme
    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }

    // Toggle between light and dark themes
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    // Initialize theme
    initTheme();

    // Load photos on page load
    displayPhotosByCategory('all');

    // Event listeners
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);

    // Category buttons event listeners
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to the clicked button
            this.classList.add('active');

            // Get the category from the button's data attribute
            const category = this.dataset.category;

            // Update the category title
            categoryTitle.textContent = `${this.textContent} `;

            // Display photos for the selected category
            displayPhotosByCategory(category);
        });
    });

    // Display photos by category
    function displayPhotosByCategory(category) {
        // Clear the gallery
        gallery.innerHTML = '';

        // Filter photos by category
        let filteredPhotos = photos;
        if (category !== 'all') {
            filteredPhotos = photos.filter(photo => photo.category === category);
        }

        // Sort photos by date (newest first)
        filteredPhotos.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Display message if no photos in category
        if (filteredPhotos.length === 0) {
            gallery.innerHTML = ` 
                <div class="no-photos-message">
                    <h3>No photos in this category</h3>
                    <p>Check out other categories!</p>
                </div>
            `;
            return;
        }

        // Calculate and update photo count
        calculatePhotoCount(filteredPhotos);

        // Add each photo to the gallery
        filteredPhotos.forEach(photo => addPhotoToGallery(photo));
    }

    // Calculate photo count and update the UI
    function calculatePhotoCount(filteredPhotos) {
        const count = filteredPhotos.length;
        photoCountDisplay.textContent = `(${count} photos)`;
    }

    // Add a photo to the gallery
    function addPhotoToGallery(photoData) {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.dataset.id = photoData.id;

        photoCard.innerHTML = `
            <div class="photo-preview">
                <img src="${photoData.src}" alt="${photoData.name}">
            </div>
            <div class="photo-info">
                <div class="photo-meta">
                </div>
            </div>
            <div class="photo-actions">
                <button class="download-btn">Download</button>
            </div>
        `;

        // Add event listeners for the buttons
        const previewImg = photoCard.querySelector('.photo-preview');
        previewImg.addEventListener('click', () => openModal(photoData.src));

        const downloadBtn = photoCard.querySelector('.download-btn');
        downloadBtn.addEventListener('click', () => downloadPhoto(photoData));

        // Add the photo card to the gallery
        gallery.appendChild(photoCard);
    }

    // Download a photo
    function downloadPhoto(photoData) {
        const a = document.createElement('a');
        a.href = photoData.src;
        a.download = photoData.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Open modal with larger image
    function openModal(src) {
        modalImg.src = src;
        modal.style.display = 'flex';
    }

    // Utility function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
