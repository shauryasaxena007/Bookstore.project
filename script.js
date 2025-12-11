// --- DOM Elements ---
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const bookContainer = document.getElementById('book-container');
const loader = document.getElementById('loader');

// Login & Cart Elements
const loginBtn = document.getElementById('login-btn');
const modal = document.getElementById('login-modal');
const closeModal = document.querySelector('.close-modal');
const loginForm = document.getElementById('login-form');
const cartCount = document.getElementById('cart-count');

let cartItemCount = 0;

// --- Event Listeners ---
searchBtn.addEventListener('click', getBooks);
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') getBooks(); });

// Login Modal Logic
loginBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Close modal if clicking outside the box
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});

// Handle Login Form Submit (Simulation)
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    modal.classList.add('hidden');
    loginBtn.innerHTML = '<i class="fas fa-user-check"></i> Welcome, User';
    loginBtn.style.background = '#2ecc71'; // Turn green
    alert("Login Successful!");
});

// Load Default Books
window.addEventListener('DOMContentLoaded', () => {
    searchInput.value = "programming";
    getBooks();
});

// --- API Logic ---
async function getBooks() {
    const query = searchInput.value.trim();
    if (!query) return;

    loader.classList.remove('hidden');
    bookContainer.innerHTML = '';

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`);
        const data = await response.json();

        if (data.totalItems === 0) {
            bookContainer.innerHTML = '<p style="text-align:center; width:100%;">No books found.</p>';
            return;
        }
        displayBooks(data.items);
    } catch (error) {
        bookContainer.innerHTML = '<p>Error fetching data.</p>';
    } finally {
        loader.classList.add('hidden');
    }
}

function displayBooks(books) {
    books.forEach(book => {
        const info = book.volumeInfo;
        const title = info.title ? (info.title.length > 35 ? info.title.substring(0, 35) + '...' : info.title) : "No Title";
        const authors = info.authors ? info.authors.join(', ') : "Unknown";
        let image = info.imageLinks ? (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail) : 'https://via.placeholder.com/128x195?text=No+Cover';
        const previewLink = info.previewLink;

        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        bookCard.innerHTML = `
            <img src="${image}" alt="${title}">
            <div class="card-body">
                <h3>${title}</h3>
                <p>${authors}</p>
                <div class="card-actions">
                    <a href="${previewLink}" target="_blank" class="btn-preview">Preview</a>
                    <button class="btn-add-cart" onclick="addToCart()">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        bookContainer.appendChild(bookCard);
    });
}

// --- Cart Functionality ---
function addToCart() {
    cartItemCount++;
    cartCount.innerText = cartItemCount;
    
    // Simple animation for the cart icon
    const cartIcon = document.querySelector('.cart-container');
    cartIcon.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}