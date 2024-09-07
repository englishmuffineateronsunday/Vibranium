const inputField = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const header = document.querySelector('header');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const changelogContainer = document.getElementById('changelog-container');
const changelogText = document.getElementById('changelog-text');
const closeChangelogButton = document.getElementById('close-changelog');
const versionLabel = document.getElementById('version-label');

const CURRENT_VERSION = '0.1.0';

function isVersionHigher(newVersion, oldVersion) {
    const [newMajor, newMinor, newPatch] = newVersion.split('.').map(Number);
    const [oldMajor, oldMinor, oldPatch] = oldVersion.split('.').map(Number);
    if (newMajor > oldMajor) return true;
    if (newMajor === oldMajor && newMinor > oldMinor) return true;
    if (newMajor === oldMajor && newMinor === oldMinor && newPatch > oldPatch) return true;
    return false;
}
function formatChangelog(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}
async function fetchChangelog() {
    const changelogUrl = 'https://englishmuffineateronsunday.github.io/Vibranium/changelog.txt';
    try {
        const response = await fetch(changelogUrl);
        if (response.ok) {
            const text = await response.text();
            const versionMatch = text.match(/VERSION\s*=\s*(\S+)/);
            if (versionMatch) {
                const changelogVersion = versionMatch[1];
                const savedVersion = localStorage.getItem('appVersion') || CURRENT_VERSION;

                if (isVersionHigher(changelogVersion, savedVersion)) {
                    setTimeout(() => {
                        changelogContainer.style.display = 'block';
                        header.style.display = 'none';
                        main.style.display = 'none';
                        footer.style.display = 'none';
                    }, 100);

                    versionLabel.textContent = `Version: ${changelogVersion}`;
                    const cleanText = text.replace(/^VERSION\s*=\s*\S+/m, '').trim();
                    const formattedText = formatChangelog(cleanText);
                    changelogText.innerHTML = formattedText;
                }
            } else {
                console.log('No version found in changelog.');
            }
        } else {
            console.error('Failed to fetch changelog:', response.status);
        }
    } catch (error) {
        console.error('Error fetching changelog:', error);
    }
}
function updateVersion(newVersion) {
    localStorage.setItem('appVersion', newVersion);
}

closeChangelogButton.addEventListener('click', () => {
    document.body.remove(changelogContainer)
    header.style.display = '';
    main.style.display = '';
    footer.style.display = '';
    const changelogVersion = versionLabel.textContent.replace('Version: ', '');
    updateVersion(changelogVersion);
});

function openIframe(query) {
    header.style.display = 'none';
    main.style.display = 'none';
    footer.style.display = 'none';

    const iframeContainer = document.createElement('div');
    iframeContainer.style.position = 'fixed';
    iframeContainer.style.top = '0';
    iframeContainer.style.left = '0';
    iframeContainer.style.width = '100%';
    iframeContainer.style.height = '100%';
    iframeContainer.style.backgroundColor = '#fff';
    iframeContainer.style.zIndex = '1000';

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = query;

    const closeButton = document.createElement('button');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '20px';
    closeButton.style.zIndex = '1001';
    closeButton.style.width = '25px';
    closeButton.style.height = '25px';
    closeButton.style.padding = '0';
    closeButton.style.border = '2px solid #7700e7';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.color = '#fff';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '50%';
    closeButton.style.fontSize = '12px';
    closeButton.style.display = 'flex';
    closeButton.style.alignItems = 'center';
    closeButton.style.justifyContent = 'center';
    closeButton.style.transition = 'background-color 0.3s, color 0.3s';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.onclick = function () {
        header.style.display = '';
        main.style.display = '';
        footer.style.display = '';
        document.body.removeChild(iframeContainer);
    };

    const reloadButton = document.createElement('button');
    reloadButton.style.position = 'absolute';
    reloadButton.style.top = '10px';
    reloadButton.style.right = '55px';
    reloadButton.style.zIndex = '1001';
    reloadButton.style.width = '25px';
    reloadButton.style.height = '25px';
    reloadButton.style.padding = '0';
    reloadButton.style.border = '2px solid #7700e7';
    reloadButton.style.backgroundColor = 'transparent';
    reloadButton.style.color = '#fff';
    reloadButton.style.cursor = 'pointer';
    reloadButton.style.borderRadius = '50%';
    reloadButton.style.fontSize = '12px';
    reloadButton.style.display = 'flex';
    reloadButton.style.alignItems = 'center';
    reloadButton.style.justifyContent = 'center';
    reloadButton.style.transition = 'background-color 0.3s, color 0.3s';
    reloadButton.innerHTML = '<i class="fas fa-sync"></i>';
    reloadButton.onclick = function () {
        iframe.src = query;
    };

    iframeContainer.appendChild(iframe);
    iframeContainer.appendChild(closeButton);
    iframeContainer.appendChild(reloadButton);
    document.body.appendChild(iframeContainer);
}
function formatQuery(query) {
    const domainRegex = /\.(com|org|edu|net|gov|io|co|info)$/i;

    if (query.startsWith('https://')) {
        return `https://uv-staticf.pages.dev/static/embed#${(query)}`;
    } else if (domainRegex.test(query)) {
        return `https://uv-staticf.pages.dev/static/embed#https://www.${encodeURIComponent(query)}`;
    } else {
        return `https://uv-staticf.pages.dev/static/embed#https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
}
function performSearch() {
    let query = inputField.value.trim();
    if (query) {
        const formattedQuery = formatQuery(query);
        openIframe(formattedQuery);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchChangelog();

    searchButton.addEventListener('click', performSearch);
    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});
