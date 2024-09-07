// settings.js

document.addEventListener('DOMContentLoaded', () => {
    const settingsTab = document.getElementById('settings');
    const closeButton = document.getElementById('close-settings');

    document.querySelector('nav ul li a[href$="settings.html"]').addEventListener('click', (event) => {
        event.preventDefault();
        settingsTab.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        settingsTab.style.display = 'none';
    });

    const loadSettings = () => {
        const setting1 = localStorage.getItem('setting1') || 'option1';
        const setting2 = localStorage.getItem('setting2') === 'true';
        const setting3 = localStorage.getItem('setting3') || 50;

        document.getElementById('setting1').value = setting1;
        document.getElementById('setting2').checked = setting2;
        document.getElementById('setting3').value = setting3;
    };

    const saveSettings = () => {
        const setting1 = document.getElementById('setting1').value;
        const setting2 = document.getElementById('setting2').checked;
        const setting3 = document.getElementById('setting3').value;

        localStorage.setItem('setting1', setting1);
        localStorage.setItem('setting2', setting2);
        localStorage.setItem('setting3', setting3);
    };

    document.getElementById('setting1').addEventListener('change', saveSettings);
    document.getElementById('setting2').addEventListener('change', saveSettings);
    document.getElementById('setting3').addEventListener('input', saveSettings);

    loadSettings(); 
});
