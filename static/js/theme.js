document.addEventListener("DOMContentLoaded", function () {
    function updateThemeAssets(theme) {
        const favicon = document.querySelector('link[rel="icon"]');
        const logo = document.querySelector('.logo .icon img');

        if (!favicon || !logo) {
            console.error('Favicon or logo element not found');
            return;
        }

        const assets = {
            default: {
                favicon: "static/images/logo.png",
                logo: "static/images/logo.png"
            },
            green: {
                favicon: "static/images/greenLogo.png",
                logo: "static/images/greenLogo.png"
            },
            blue: {
                favicon: "static/images/blueLogo.png",
                logo: "static/images/blueLogo.png"
            },
            orange: {
                favicon: "static/images/orangeLogo.png",
                logo: "static/images/orangeLogo.png"
            },
            redPink: {
                favicon: "static/images/pinkRedLogo.png",
                logo: "static/images/pinkRedLogo.png"
            },
        };

        if (assets[theme]) {
            favicon.href = assets[theme].favicon;
            logo.src = assets[theme].logo;
        } else {
            console.error('Theme assets not found for theme:', theme);
        }
    }

    const currentTheme = document.body.getAttribute('data-theme') || 'default';
    updateThemeAssets(currentTheme);

    document.body.addEventListener('changeTheme', function (event) {
        updateThemeAssets(event.detail.theme);
    });
});
