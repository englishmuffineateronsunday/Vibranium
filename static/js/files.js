const favoriteIcons = document.querySelectorAll('.favorite-icon');
const cardButtons = document.querySelectorAll('.card-button');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const cardsContainer = document.querySelector('.cards-container');
const categoryPicker = document.getElementById('category-picker');

const categoryMapping = {
    'actionadventure': ['action', 'adventure'],
    'arcade': ['arcade'],
    'shooting': ['shooting', 'shooter'],
    'cardriving': ['car', 'driving'],
    'clicker': ['clicker'],
    'sports': ['sports'],
    'stratpuzzquiz': ['strategy', 'puzzle', 'quiz'],
    'horrorscary': ['horror', 'scary']
};

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
function initializeFavorites() {
    const favorites = getFavorites();
    favoriteIcons.forEach(icon => {
        const id = icon.getAttribute('data-id');
        if (favorites.includes(id)) {
            icon.classList.add('favorited');
            icon.innerHTML = '<i class="fas fa-star favorite"></i>';
            icon.style.color = '#face1cd8';
        } else {
            icon.classList.remove('favorited');
            icon.innerHTML = '<i class="fas fa-star"></i>';
            icon.style.color = '#b5b5b5a3';
        }
    });
}
function handleFavoriteClick(event) {
    event.stopPropagation();
    const icon = event.currentTarget;
    const id = icon.getAttribute('data-id');
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(favoriteId => favoriteId !== id);
        icon.classList.remove('favorited');
        icon.innerHTML = '<i class="fas fa-star"></i>';
        icon.style.color = '#b5b5b5a3';
    } else {
        favorites.push(id);
        icon.classList.add('favorited');
        icon.innerHTML = '<i class="fas fa-star favorite"></i>';
        icon.style.color = '#face1cd8';
    }

    saveFavorites(favorites);
    sortCards();
}
function filterCards() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryPicker.value.toLowerCase();

    cardButtons.forEach(button => {
        const titleElement = button.querySelector('.card-title');
        const title = titleElement ? titleElement.textContent.trim().toLowerCase() : '';
        const categories = button.getAttribute('data-category').toLowerCase().split(' ');

        const matchesSearch = title.includes(query);
        const matchesCategory = selectedCategory === 'all' || 
            Object.values(categoryMapping).flat().some(cat => categories.includes(cat) && categoryMapping[selectedCategory]?.includes(cat));

        button.classList.toggle('hidden', !(matchesSearch && matchesCategory));
    });

    sortCards();
}

function sortCards() {
    const favorites = getFavorites();
    const sortedButtons = Array.from(cardButtons).sort((a, b) => {
        const titleA = a.querySelector('.card-title').textContent.trim();
        const titleB = b.querySelector('.card-title').textContent.trim();

        if (titleA === 'Request a Game') return -1;
        if (titleB === 'Request a Game') return 1;
        if (titleA === 'Request an App') return -1;
        if (titleB === 'Request an App') return 1;

        const isAFavorite = a.querySelector('.favorite-icon')?.getAttribute('data-id') && favorites.includes(a.querySelector('.favorite-icon').getAttribute('data-id'));
        const isBFavorite = b.querySelector('.favorite-icon')?.getAttribute('data-id') && favorites.includes(b.querySelector('.favorite-icon').getAttribute('data-id'));

        if (isAFavorite && !isBFavorite) return -1;
        if (!isAFavorite && isBFavorite) return 1;

        return 0;
    });

    sortedButtons.forEach(button => cardsContainer.appendChild(button));
}

function setupEventListeners() {
    cardButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = button.getAttribute('data-url');
        });
    });

    favoriteIcons.forEach(icon => {
        icon.addEventListener('click', handleFavoriteClick);
    });

    searchButton.addEventListener('click', filterCards);
    searchInput.addEventListener('input', filterCards);
    categoryPicker.addEventListener('change', filterCards);
}

function init() {
    initializeFavorites();
    setupEventListeners();
    filterCards();
}

document.addEventListener('DOMContentLoaded', () => {
    const lazyCards = document.querySelectorAll('.card img[data-src]');
    const loadCard = (img) => {
        const src = img.getAttribute('data-src');
        img.src = src;
        img.removeAttribute('data-src');
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadCard(img);
                observer.unobserve(img);
            }
        });
    });

    lazyCards.forEach(img => observer.observe(img));
    init();
});
