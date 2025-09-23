// E-Commerce Product Showcase JavaScript

// Global Variables
let allProducts = [];
let filteredProducts = [];
let cart = [];
let categories = [];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchIcon = document.getElementById('searchIcon');
const searchIconContainer = document.getElementById('searchIconContainer');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const productsGrid = document.getElementById('productsGrid');
const loading = document.getElementById('loading');
const resultsCount = document.getElementById('resultsCount');
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const productModalBody = document.getElementById('productModalBody');
const promoBanner = document.getElementById('promoBanner');
const promoClose = document.getElementById('promoClose');
const promoSignupBtn = document.getElementById('promoSignupBtn');
const accountIcon = document.getElementById('accountIcon');

// Sidebar filter elements
const categoryFilters = document.getElementById('categoryFilters');
const clearFilters = document.getElementById('clearFilters');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');
const applyPrice = document.getElementById('applyPrice');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    checkPromoBannerStatus();
    fetchProducts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Search functionality
    if (searchIcon) {
        searchIcon.addEventListener('click', toggleSearchExpansion);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('blur', collapseSearch);
    }
    
    categoryFilter.addEventListener('change', handleFilter);
    sortFilter.addEventListener('change', handleSort);
    
    cartIcon.addEventListener('click', openCartModal);
    closeCart.addEventListener('click', closeCartModal);
    closeModal.addEventListener('click', closeProductModal);
    
    // Sidebar filter event listeners
    if (clearFilters) {
        clearFilters.addEventListener('click', handleClearFilters);
    }
    if (applyPrice) {
        applyPrice.addEventListener('click', handlePriceFilter);
    }
    
    // Promo banner event listeners
    promoClose.addEventListener('click', closePromoBanner);
    promoSignupBtn.addEventListener('click', handlePromoSignup);
    
    // Close modals when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) closeCartModal();
    });
    
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });
}

// Fetch Products from API
async function fetchProducts() {
    try {
        showLoading(true);
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        
        allProducts = products;
        filteredProducts = [...products];
        
        extractCategories(products);
        populateCategoryFilter();
        displayProducts(products);
        
    } catch (error) {
        console.error('Error fetching products:', error);
        showError('Failed to load products. Please try again later.');
    } finally {
        showLoading(false);
    }
}

// Extract unique categories
function extractCategories(products) {
    categories = [...new Set(products.map(product => product.category))];
}

// Populate category filter dropdown
function populateCategoryFilter() {
    // Populate top dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
    
    // Populate sidebar category filters
    if (categoryFilters) {
        categories.forEach(category => {
            const label = document.createElement('label');
            label.className = 'category-option';
            label.innerHTML = `
                <input type="radio" name="category" value="${category}"> 
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            `;
            categoryFilters.appendChild(label);
        });
        
        // Add event listeners to sidebar category radios
        const categoryRadios = categoryFilters.querySelectorAll('input[name="category"]');
        categoryRadios.forEach(radio => {
            radio.addEventListener('change', handleSidebarCategoryFilter);
        });
    }
}

// Update results count display
function updateResultsCount(count) {
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
    }
}

// Display products in grid
function displayProducts(products) {
    // Update results count
    updateResultsCount(products.length);
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary view-details" data-id="${product.id}">
                        Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to product cards
    addProductEventListeners();
}

// Add event listeners to product cards
function addProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });
    
    // View details buttons
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            showProductDetails(productId);
        });
    });
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    applyFiltersAndSort();
}

// Search expansion functionality
function toggleSearchExpansion() {
    if (searchIconContainer) {
        searchIconContainer.classList.toggle('expanded');
        if (searchIconContainer.classList.contains('expanded')) {
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        }
    }
}

function collapseSearch() {
    setTimeout(() => {
        if (searchIconContainer && !searchInput.value.trim()) {
            searchIconContainer.classList.remove('expanded');
        }
    }, 150);
}

// Category filter
function handleFilter() {
    const selectedCategory = categoryFilter.value;
    
    if (selectedCategory === 'all') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => product.category === selectedCategory);
    }
    
    // Apply search if there's a search term
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm !== '') {
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    applyFiltersAndSort();
}

// Sort functionality
function handleSort() {
    applyFiltersAndSort();
}

// Apply current filters and sorting
function applyFiltersAndSort() {
    let productsToDisplay = [...filteredProducts];
    
    // Apply sorting
    const sortValue = sortFilter.value;
    if (sortValue === 'low-high') {
        productsToDisplay.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'high-low') {
        productsToDisplay.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'name') {
        productsToDisplay.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    displayProducts(productsToDisplay);
}

// Sidebar category filter handler
function handleSidebarCategoryFilter() {
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    
    // Update the top dropdown to match
    categoryFilter.value = selectedCategory;
    
    // Apply the filter
    handleFilter();
}

// Clear all filters
function handleClearFilters() {
    // Reset all form elements
    document.querySelector('input[name="category"][value="all"]').checked = true;
    categoryFilter.value = 'all';
    sortFilter.value = 'default';
    searchInput.value = '';
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    
    // Reset filtered products to all products
    filteredProducts = [...allProducts];
    applyFiltersAndSort();
}

// Price range filter handler
function handlePriceFilter() {
    const min = parseFloat(minPrice.value) || 0;
    const max = parseFloat(maxPrice.value) || Infinity;
    
    if (min > max && max !== Infinity) {
        alert('Minimum price cannot be greater than maximum price');
        return;
    }
    
    // Start with current filtered products
    let products = [...allProducts];
    
    // Apply category filter if any
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    if (selectedCategory !== 'all') {
        products = products.filter(product => product.category === selectedCategory);
    }
    
    // Apply search filter if any
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm !== '') {
        products = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply price filter
    products = products.filter(product => product.price >= min && product.price <= max);
    
    filteredProducts = products;
    applyFiltersAndSort();
}

// Cart functionality
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showCartNotification();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
    displayCartItems();
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
        saveCartToStorage();
        displayCartItems();
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Cart modal functionality
function openCartModal() {
    cartModal.classList.add('active');
    displayCartItems();
}

function closeCartModal() {
    cartModal.classList.remove('active');
}

function displayCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');
}

// Product details modal
function showProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    productModalBody.innerHTML = `
        <div class="product-details">
            <img src="${product.image}" alt="${product.title}" class="product-detail-image">
            <div class="product-detail-info">
                <h2>${product.title}</h2>
                <p class="product-detail-category">${product.category}</p>
                <p class="product-detail-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span>Rating: ${product.rating?.rate || 'N/A'} ⭐ (${product.rating?.count || 0} reviews)</span>
                </div>
                <button class="btn btn-primary add-to-cart-modal" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    productModal.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
}

// Local Storage functions
function saveCartToStorage() {
    localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('ecommerce-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Utility functions
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
    productsGrid.innerHTML = `<div class="error-message">${message}</div>`;
}

function showCartNotification() {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Product added to cart!';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--action-color);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Promo Banner Functions
function checkPromoBannerStatus() {
    const bannerClosed = localStorage.getItem('promoBannerClosed');
    const signedUp = localStorage.getItem('promoSignedUp');
    
    if (bannerClosed === 'true' || signedUp === 'true') {
        hidePromoBanner();
    }
}

function closePromoBanner() {
    localStorage.setItem('promoBannerClosed', 'true');
    hidePromoBanner();
}

function hidePromoBanner() {
    promoBanner.classList.add('hidden');
    document.body.classList.add('no-promo-banner');
}

function handlePromoSignup() {
    // Simple signup simulation - in a real app, this would open a signup modal or redirect
    const email = prompt('Enter your email to get 20% OFF with code WELCOME20:');
    
    if (email && email.includes('@')) {
        localStorage.setItem('promoSignedUp', 'true');
        localStorage.setItem('userEmail', email);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'signup-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 70px;
                right: 20px;
                background: linear-gradient(135deg, #2c5530 0%, #A2AF9B 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 1002;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                max-width: 300px;
            ">
                <strong>🎉 Welcome!</strong><br>
                Check your email for the <strong>WELCOME20</strong> discount code!
                <br><small>You'll save 20% on your first order!</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            hidePromoBanner();
        }, 4000);
        
    } else if (email !== null) {
        alert('Please enter a valid email address.');
    }
}