document.addEventListener('DOMContentLoaded', () => {
    const favoritesList = document.querySelector('.favorites ul');
    const profileImg = document.getElementById('profile-img');
    const usernameElement = document.getElementById('username');
    const fileUpload = document.getElementById('file-upload');
    const editIcon = document.querySelector('.edit-icon');
    const statsList = document.querySelector('.game-stats-list'); 
    const usernameInput = document.createElement('input'); 

    function formatFavoriteName(name) {
        return name
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    function formatTime(seconds) {
        const weeks = Math.floor(seconds / (7 * 24 * 60 * 60));
        seconds %= (7 * 24 * 60 * 60);
        const days = Math.floor(seconds / (24 * 60 * 60));
        seconds %= (24 * 60 * 60);
        const hours = Math.floor(seconds / (60 * 60));
        seconds %= (60 * 60);
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);

        const timeString = [];
        if (weeks > 0) timeString.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
        if (days > 0) timeString.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) timeString.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) timeString.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        if (seconds > 0) timeString.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

        return timeString.join(', ');
    }

    function loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesList.innerHTML = '';

        favorites.forEach(favorite => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `../files/${favorite}.html`;
            link.textContent = formatFavoriteName(favorite);
            link.classList.add('favorite-link');
            listItem.appendChild(link);
            favoritesList.appendChild(listItem);
        });
    }

    function loadUserProfile() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};

        if (userProfile.profilePicture) {
            profileImg.src = userProfile.profilePicture;
        }

        if (userProfile.username) {
            usernameElement.textContent = userProfile.username;
        }

        loadGameStats(userProfile); 
    }

    function loadGameStats(userProfile) {
        if (userProfile.gameTime) {
            statsList.innerHTML = ''; 
            Object.keys(userProfile.gameTime).forEach(game => {
                const formattedGameName = formatFavoriteName(game);
                const formattedTime = formatTime(userProfile.gameTime[game]);

                const gameStatItem = document.createElement('li');
                gameStatItem.textContent = `${formattedGameName}: ${formattedTime}`;
                gameStatItem.style.color = '#fff'; 
                statsList.appendChild(gameStatItem);
            });
        } else {
            statsList.innerHTML = '<li>No game stats available.</li>';
        }
    }

    fileUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                profileImg.src = imageUrl;

                const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
                userProfile.profilePicture = imageUrl;
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
            };
            reader.readAsDataURL(file);
        }
    });

    editIcon.addEventListener('click', () => {
        usernameInput.value = usernameElement.textContent;
        usernameInput.style.fontSize = '1.5rem';
        usernameInput.style.color = '#fff';
        usernameInput.style.backgroundColor = 'transparent';
        usernameInput.style.border = 'none';
        usernameInput.style.borderBottom = '2px solid #7700e7';
        usernameInput.style.padding = '3px';
        usernameInput.style.marginLeft = '5px';
        usernameInput.style.outline = 'none';
        usernameInput.style.width = '150px'; 

        const container = document.createElement('div');
        container.style.display = 'inline-block';
        container.style.position = 'relative';
        container.style.width = '150px';
        container.appendChild(usernameInput);

        usernameElement.replaceWith(container);
        usernameInput.focus();
        usernameInput.addEventListener('blur', () => {
            const newUsername = usernameInput.value.trim();
            if (newUsername) {
                usernameElement.textContent = newUsername;
                const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
                userProfile.username = newUsername;
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
            }
            container.replaceWith(usernameElement);
        });
    });

    loadFavorites();
    loadUserProfile();
});
