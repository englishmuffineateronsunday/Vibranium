const favoriteIcons = document.querySelectorAll('.favorite-icon');
const cardButtons = document.querySelectorAll('.card-button');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const cardsContainer = document.querySelector('.cards-container');

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
    cardButtons.forEach(button => {
        const titleElement = button.querySelector('.card-title');
        const title = titleElement ? titleElement.textContent.trim().toLowerCase() : '';
        button.classList.toggle('hidden', !title.includes(query));
    });
    sortCards();
}
function sortCards() {
    const favorites = getFavorites();

    const sortedButtons = Array.from(cardButtons).sort((a, b) => {
        const iconA = a.querySelector('.favorite-icon');
        const iconB = b.querySelector('.favorite-icon');

        if (!iconA || !iconB) return 0;

        const idA = iconA.getAttribute('data-id');
        const idB = iconB.getAttribute('data-id');
        
        if (!idA || !idB) return 0;

        const isAFavorite = favorites.includes(idA);
        const isBFavorite = favorites.includes(idB);
        
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
}
function init() {
    initializeFavorites();
    setupEventListeners();
    sortCards();
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
