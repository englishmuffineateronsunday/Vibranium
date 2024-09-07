document.addEventListener('DOMContentLoaded', () => {
    const changelogUrl = 'https://englishmuffineateronsunday.github.io/Vibranium/changelog.txt';

    async function checkForUpdates() {
        try {
            const response = await fetch(changelogUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const text = await response.text();
            const versionMatch = text.match(/^VERSION\s*=\s*([\d.]+)/m);
            if (versionMatch) {
                const latestVersion = versionMatch[1];
                const storedVersion = localStorage.getItem('appVersion') || '0.0.0';

                if (compareVersions(latestVersion, storedVersion) > 0) {
                    window.location.href = '../index.html';
                }
            }
        } catch (error) {
            console.error('Error fetching or parsing changelog:', error);
        }
    }

    function compareVersions(version1, version2) {
        const v1Parts = version1.split('.').map(num => parseInt(num, 10));
        const v2Parts = version2.split('.').map(num => parseInt(num, 10));
        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const part1 = v1Parts[i] || 0;
            const part2 = v2Parts[i] || 0;
            if (part1 > part2) return 1;
            if (part1 < part2) return -1;
        }
        return 0;
    }

    checkForUpdates();
});
