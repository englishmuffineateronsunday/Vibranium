const searchInp = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');
const header = document.querySelector('header');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const clContain = document.getElementById('changelog-container');
const clTxt = document.getElementById('changelog-text');
const clClose = document.getElementById('close-changelog');
const vL = document.getElementById('version-label');

const cV = '0.1.0';

function vh(n, o) {
    const [nMaj, nMin, nPat] = n.split('.').map(Number);
    const [oMaj, oMin, oPat] = o.split('.').map(Number);
    if (nMaj > oMaj) return true;
    if (nMaj === oMaj && nMin > oMin) return true;
    if (nMaj === oMaj && nMin === oMin && nPat > oPat) return true;
    return false;
}
function formCL(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}
async function fetCL() {
    const CLurl = 'https://englishmuffineateronsunday.github.io/Vibranium/changelog.txt';
    try {
        const response = await fetch(CLurl);
        if (response.ok) {
            const text = await response.text();
            const versionMajatch = text.match(/VERSION\s*=\s*(\S+)/);
            if (versionMajatch) {
                const changelogVersion = versionMajatch[1];
                const savedVersion = localStorage.getItem('appVersion') || cV;

                if (vh(changelogVersion, savedVersion)) {
                    setTimeout(() => {
                        clContain.style.display = 'block';
                        header.style.display = 'none';
                        main.style.display = 'none';
                        footer.style.display = 'none';
                    }, 100);

                    vL.textContent = `Version: ${changelogVersion}`;
                    const cleanText = text.replace(/^VERSION\s*=\s*\S+/m, '').trim();
                    const formattedText = formCL(cleanText);
                    clTxt.innerHTML = formattedText;
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
function updV(n) {
    localStorage.setItem('appVersion', n);
}
function oIf(q) {
    header.style.display = 'none';
    main.style.display = 'none';
    footer.style.display = 'none';

    const iC = document.createElement('div');
    iC.style.position = 'fixed';
    iC.style.top = '0';
    iC.style.left = '0';
    iC.style.width = '100%';
    iC.style.height = '100%';
    iC.style.backgroundColor = '#fff';
    iC.style.zIndex = '1000';

    const i = document.createElement('iframe');
    i.style.width = '100%';
    i.style.height = '100%';
    i.style.border = 'none';
    i.src = q;

    const cB = document.createElement('button');
    cB.style.position = 'absolute';
    cB.style.top = '10px';
    cB.style.right = '20px';
    cB.style.zIndex = '1001';
    cB.style.width = '25px';
    cB.style.height = '25px';
    cB.style.padding = '0';
    cB.style.border = '2px solid #7700e7';
    cB.style.backgroundColor = 'transparent';
    cB.style.color = '#fff';
    cB.style.cursor = 'pointer';
    cB.style.borderRadius = '50%';
    cB.style.fontSize = '12px';
    cB.style.display = 'flex';
    cB.style.alignItems = 'center';
    cB.style.justifyContent = 'center';
    cB.style.transition = 'background-color 0.3s, color 0.3s';
    cB.innerHTML = '<i class="fas fa-times"></i>';
    cB.onclick = function () {
        header.style.display = '';
        main.style.display = '';
        footer.style.display = '';
        document.body.removeChild(iC);
    };

    const rB = document.createElement('button');
    rB.style.position = 'absolute';
    rB.style.top = '10px';
    rB.style.right = '55px';
    rB.style.zIndex = '1001';
    rB.style.width = '25px';
    rB.style.height = '25px';
    rB.style.padding = '0';
    rB.style.border = '2px solid #7700e7';
    rB.style.backgroundColor = 'transparent';
    rB.style.color = '#fff';
    rB.style.cursor = 'pointer';
    rB.style.borderRadius = '50%';
    rB.style.fontSize = '12px';
    rB.style.display = 'flex';
    rB.style.alignItems = 'center';
    rB.style.justifyContent = 'center';
    rB.style.transition = 'background-color 0.3s, color 0.3s';
    rB.innerHTML = '<i class="fas fa-sync"></i>';
    rB.onclick = function () {
        i.src = q;
    };

    iC.appendChild(i);
    iC.appendChild(cB);
    iC.appendChild(rB);
    document.body.appendChild(iC);
}
function formQ(q) {
    const dRegex = /\.(com|org|edu|net|gov|io|co|info)$/i;

    if (q.startsWith('https://')) {
        return `https://uv-staticf.pages.dev/static/embed#${(q)}`;
    } else if (dRegex.test(q)) {
        return `https://uv-staticf.pages.dev/static/embed#https://www.${encodeURIComponent(q)}`;
    } else {
        return `https://uv-staticf.pages.dev/static/embed#https://www.google.com/search?q=${encodeURIComponent(q)}`;
    }
}
function perS() {
    let q = searchInp.value.trim();
    if (q) {
        const fQ = formQ(q);
        oIf(fQ);
    }
}

clClose.addEventListener('click', () => {
    clContain.remove();
    header.style.display = '';
    main.style.display = '';
    footer.style.display = '';
    const changelogVersion = vL.textContent.replace('Version: ', '');
    updV(changelogVersion);
});

document.addEventListener('DOMContentLoaded', () => {
    fetCL();

    searchBtn.addEventListener('click', perS);
    searchInp.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            perS();
        }
    });
});
