document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card-button').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = button.getAttribute('data-url');
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const cardButtons = document.querySelectorAll('.card-button');

    function filterCards() {
        const query = searchInput.value.trim().toLowerCase();
        if (query === '' || query.length > 30) {
            cardButtons.forEach(button => button.classList.remove('hidden'));
            return;
        }
        cardButtons.forEach(button => {
            const titleElement = button.querySelector('.card-title');
            if (titleElement) {
                const title = titleElement.textContent.trim().toLowerCase();
                button.classList.toggle('hidden', !title.includes(query));
            }
        });
    }
    searchButton.addEventListener('click', filterCards);
    searchInput.addEventListener('input', () => {
        filterCards();
    });
});

