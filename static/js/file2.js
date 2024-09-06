document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('content-iframe');
    const fullscreenButton = document.getElementById('fullscreen-button');
    const reloadButton = document.getElementById('reload-button');

    function enterFullscreen() {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { 
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { 
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { 
            iframe.msRequestFullscreen();
        }
    }

    function reloadIframe() {
        try {
            iframe.contentWindow.location.reload();
        } catch (e) {
            iframe.src = iframe.src;
        }
    }

    fullscreenButton.addEventListener('click', enterFullscreen);
    reloadButton.addEventListener('click', reloadIframe);
});
