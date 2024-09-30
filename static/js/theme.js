document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    
});

function applyStoredTheme() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    
    if (userProfile.theme) {
        document.body.setAttribute('data-theme', userProfile.theme);

        if (window.location.pathname.includes('flash')) {
            changeBoltImages(userProfile.theme);
        }
    }
}

function changeBoltImages(theme) {
    const boltImageElements = document.querySelectorAll('.card-thumbnail');

    boltImageElements.forEach((img) => {
        switch (theme) {
            case 'purple':
                img.src = '../static/images/purple.png'; 
                break;
            case 'lightblue':
                img.src = '../static/images/lightblue.png'; 
                break;
            case 'pinkishred':
                img.src = '../static/images/pinkishred.png'; 
                break;
            case 'orange':
                img.src = '../static/images/orange.png'; 
                break;
            case 'blue':
                img.src = '../static/images/blue.png'; 
                break;
            case 'green':
                img.src = '../static/images/green.png'; 
                break;
            case 'pink':
                img.src = '../static/images/pink.png'; 
                break; 
            default:
                img.src = '../static/images/purple.png'; 
                break;
        }
    });
}