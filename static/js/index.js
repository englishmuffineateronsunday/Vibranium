document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    function performSearch() {
        let query = inputField.value.trim();
        if (query) {
            if (query.startsWith('http://')) {
                query = query.replace('http://', 'https://');
            }
            if (!query.startsWith('https://')) {
                query = `https://uv-staticf.pages.dev/static/embed#https://www.google.com/search?q=${encodeURIComponent(query)}`;
            } else {
                query = `https://uv-staticf.pages.dev/static/embed#${(query)}`;
            }

            const newWindow = window.open('about:blank', '_blank');
            const iframe = newWindow.document.createElement('iframe');
            iframe.style.width = '100%'; 
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.src = query;

            newWindow.document.body.appendChild(iframe);
        }
    }

    searchButton.addEventListener('click', performSearch);

    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});
