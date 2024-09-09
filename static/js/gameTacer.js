document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('content-iframe');
    const reloadButton = document.getElementById('reload-button'); 
    let startTime = 0;
    let accumulatedTime = 0; 

    const gameName = document.title.split('Vibranium - ')[1].trim();

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

    function saveTimeSpent(gameName, timeSpent) {
        const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
        if (!userProfile.gameTime) {
            userProfile.gameTime = {};
        }
        userProfile.gameTime[gameName] = (userProfile.gameTime[gameName] || 0) + timeSpent;
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        const formattedTime = formatTime(userProfile.gameTime[gameName]);
        console.log(`Saved time for ${gameName}: ${formattedTime}`);
    }

    iframe.addEventListener('load', () => {
        if (startTime === 0) {  
            startTime = Date.now();
        } else {
            const reloadTime = Date.now();
            const timeSpent = (reloadTime - startTime) / 1000; 
            accumulatedTime += timeSpent;
            startTime = reloadTime;  
        }
    });

    reloadButton.addEventListener('click', () => {
        iframe.contentWindow.location.reload();
    });

    function calculateAndSaveTime() {
        if (startTime > 0) {
            const endTime = Date.now();
            const timeSpent = (endTime - startTime) / 1000;
            const totalTimeSpent = accumulatedTime + timeSpent;
            saveTimeSpent(gameName, totalTimeSpent);
            console.log('time:', formatTime(totalTimeSpent));
        } else {
            return
        }
    }

    window.addEventListener('beforeunload', calculateAndSaveTime);
    iframe.addEventListener('unload', () => {
        calculateAndSaveTime();
    });
});
