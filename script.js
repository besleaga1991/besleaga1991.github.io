const isApple = /Mac|iPhone|iPod|iPad/.test(navigator.platform) ||
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if (isApple) {
    document.body.classList.add('apple-device');
}

const year = 2026;
const name = "Beșleagă Alexandru Marian";

if(document.getElementById('copyright-notice')) {
    document.getElementById('copyright-notice').innerText = `© ${year} ${name}. Toate drepturile rezervate.`;
}

// Verificare sesiune la incarcare
window.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('userSession');
    if (session === 'active') {
        const storedData = localStorage.getItem('userAccount');
        if (storedData) {
            const user = JSON.parse(storedData);
            const now = new Date().getTime();
            if (now < user.expiresAt) {
                startDashboard(user);
            } else {
                handleLogout();
            }
        }
    }
});

function showLegal(type) {
    const modal = document.getElementById('legalModal');
    const content = document.getElementById('legalText');
    
    if(type === 'terms') {
        content.innerHTML = `
            <h2>Termeni și Condiții</h2>
            <div class="legal-text-body">
                <strong>1. Definiția „Website”:</strong> Produsul final reprezintă o colecție organizată de texte și imagini, structurată corespunzător conform cerințelor solicitate de client. <br><br>
                <strong>2. Structura Tehnică:</strong><br>
                • <strong>Header:</strong> Secțiunea superioară (navigare și logo).<br>
                • <strong>Body:</strong> Conținutul principal al paginilor.<br>
                • <strong>Footer:</strong> Secțiunea inferioară pentru date legale.<br><br>
                <strong>3. Specificații:</strong> Include între 1 și 5 pagini, meniu, conținut, Termeni și Condiții și Politica de Confidențialitate.<br><br>
                <strong>4. Livrare:</strong> Plata reprezintă acceptul începerii lucrului. Termenul de livrare este de <strong>31 de zile</strong>, produsul fiind predat la sfârșitul primei luni de activitate (începutul lunii a doua).
            </div>`;
    } else if(type === 'privacy') {
        content.innerHTML = `
            <h2>Politică de Confidențialitate</h2>
            <div class="legal-text-body">
                Datele sunt procesate securizat prin Stripe. Nu stocăm informații bancare; toate plățile sunt gestionate prin <strong>Power of Stripe</strong>.<br><br>
                Acest serviciu respectă normele impuse de <span class="law-link" onclick="showLegal('law')">Legea 365/2002</span> privind comerțul electronic.<br><br>
                E-mailul dvs. este folosit doar pentru facturare și comunicare tehnică.
            </div>`;
    } else if(type === 'gdpr') {
        content.innerHTML = `
            <h2>Protecția Datelor (GDPR)</h2>
            <div class="legal-text-body">
                Conform <strong>Regulamentului (UE) 2016/679 (GDPR)</strong>, vă informăm asupra drepturilor privind protecția datelor cu caracter personal:<br><br>
                <strong>1. Drepturile Persoanei Vizate:</strong> Aveți dreptul de acces la date (Art. 15), dreptul la rectificare (Art. 16), dreptul la ștergerea datelor (Art. 17) și dreptul la restricționarea prelucrării (Art. 18).<br><br>
                <strong>2. Temeiul Juridic:</strong> Prelucrarea este necesară pentru executarea unui contract la care persoana vizată este parte sau pentru a face demersuri la cererea persoanei vizate înainte de încheierea unui contract (Art. 6, alin. 1, lit. b).<br><br>
                <strong>3. Portabilitatea și Opoziția:</strong> Aveți dreptul de a primi datele într-un format structurat și dreptul de a vă opune prelucrării în orice moment din motive legate de situația dvs. particulară.<br><br>
                <strong>4. Autoritatea de Supraveghere:</strong> Aveți dreptul de a depune o plângere la ANSPDCP în cazul în care considerați că prelucrarea încalcă prevederile legale în vigoare.
            </div>`;
    } else if(type === 'security') {
        content.innerHTML = `
            <h2>Securitate</h2>
            <div class="legal-text-body">
                Siguranța datelor este integrată în ecosistemul nostru de lucru. În conformitate cu politicile de protecție a informațiilor, utilizăm exclusiv sisteme de operare <strong>iOS, macOS, watchOS,tvOS și visionOS </strong> pentru prelucrarea datelor cu caracter personal ale clienților.<br><br>
                <strong>Angajamentul de securitate:</strong><br>
                • Procesarea se realizează într-un mediu controlat, beneficiind de criptarea nativă a dispozitivelor Apple.<br>
                • Standardele de securitate aplicate sunt conforme cu cerințele tehnice prezentate pe <a href="https://apple.com" target="_blank" style="color: var(--stripe-blue)">https://security.apple.com</a>.<br>
                • Datele dvs. sunt accesate și gestionate prin protocoale stricte de autentificare pentru a preveni orice intervenție neautorizată.<br><br>
                Prin accesarea serviciilor noastre, vă exprimați consimțământul pentru gestionarea informațiilor în acest cadru tehnologic securizat.
            </div>`;
    } else if(type === 'law') {
        content.innerHTML = `
            <h2>Legea 365/2002</h2>
            <div class="legal-text-body">
                <strong>Art. 4: Libera circulație</strong> - Furnizarea de servicii ale societății informaționale este liberă și nu este supusă niciunei autorizări prealabile.<br><br>
                <strong>Art. 7: Informarea consumatorului</strong> - Prestatorul are obligația de a afișa datele de identificare, e-mailul și tarifele serviciilor.<br><br>
                <strong>Art. 9: Contracte electronice</strong> - Contractele încheiate prin mijloace electronice produc toate efectele legale ale unui contract sub semnătură privată.<br><br>
                <span class="anaf-sub-link" onclick="showLegal('fiscal')">Consultă obligațiile fiscale (ANAF)</span>
            </div>`;
    } else if(type === 'fiscal') {
        content.innerHTML = `
            <h2>Obligații Fiscale (ANAF)</h2>
            <div class="legal-text-body">
                <strong>Conform Codului Fiscal (Legea 227/2015):</strong><br><br>
                <strong>Art. 120:</strong> Prestatorul are obligația de a depune <strong>Declarația Unică</strong> privind impozitul pe venit și contribuțiile sociale datorate de persoanele fizice.<br><br>
                <strong>Art. 122:</strong> Veniturile nete din activități independente sunt supuse impozitării și contribuțiilor (CAS, CASS) conform plafoanelor legale.<br><br>
                Monitorizarea electronică a plăților asigură transparența totală a veniturilor raportate către bugetul de stat.
            </div>`;
    } else if(type === 'contact') {
        content.innerHTML = `
            <h2>Contact</h2>
            <div class="legal-text-body">
                Bine ați venit! Vă rog să utilizați aceste date exclusiv în <strong>scop profesional</strong>, pentru solicitări legate de serviciile web oferite. Mesajele care încalcă normele de conviețuire socială vor fi ignorate.<br><br>
                <strong>Nume:</strong> ${name}<br>
                <strong>E-mail:</strong> <a href="mailto:besleaga.1991@icloud.com" style="color: var(--stripe-blue)">besleaga.1991@icloud.com</a><br>
                <strong>Telefon:</strong> +40 725 500 865<br><br>
                <strong>Adrese de corespondență:</strong><br>
                • Str. Foișorului Nr. 4<br>
                • Bulevardul Pipera Tunari 152 - 156
            </div>`;
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('legalModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

function handleRegister() {
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const passConfirm = document.getElementById('reg-pass-confirm').value;

    if (!email || !pass || !passConfirm) { alert("Te rugăm să completezi toate câmpurile."); return; }
    if (pass !== passConfirm) { alert("Parolele nu coincid!"); return; }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 15);

    const userData = { email: email, password: pass, expiresAt: expiryDate.getTime() };
    localStorage.setItem('userAccount', JSON.stringify(userData));
    alert("Cont creat cu succes!");
    window.location.href = 'index.html';
}

function handleLogin() {
    const emailInput = document.getElementById('login-email').value;
    const passInput = document.getElementById('login-pass').value;
    const storedData = localStorage.getItem('userAccount');

    if (!storedData) { alert("Nu există niciun cont înregistrat."); return; }

    const user = JSON.parse(storedData);
    const now = new Date().getTime();

    if (now > user.expiresAt) {
        alert("Perioada de 15 zile a expirat. Contul a fost șters automat.");
        localStorage.removeItem('userAccount');
        localStorage.removeItem('userSession');
        location.reload();
        return;
    }

    if (emailInput === user.email && passInput === user.password) {
        localStorage.setItem('userSession', 'active');
        startDashboard(user);
    } else {
        alert("Email sau parolă incorectă.");
    }
}

function handleLogout() {
    localStorage.removeItem('userSession');
    location.reload();
}

function startDashboard(user) {
    const authCard = document.getElementById('auth-card');
    if(!authCard) return;

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = user.expiresAt - now;

        if (distance < 0) {
            localStorage.removeItem('userAccount');
            localStorage.removeItem('userSession');
            location.reload();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const timerElement = document.getElementById('countdown');
        if(timerElement) {
            timerElement.innerHTML = `${days}z ${hours}h ${minutes}m ${seconds}s`;
        }
    };

    authCard.innerHTML = `
        <h1>Salut,</h1>
        <span class="price" style="font-size:16px">${user.email}</span>
        <div style="background: #f0f4f8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 13px; color: var(--text-dark); margin-bottom: 5px;">Timp rămas pentru colaborare:</p>
            <div id="countdown" style="font-weight: 800; color: var(--stripe-blue); font-size: 20px;">--</div>
        </div>
        <p style="font-size: 12px; color: var(--text-light); line-height: 1.4; text-align: center;">
            Aveți 15 zile la dispoziție sa găsiți un client. Success ! Acest cont se va șterge automat după acesta perioada.
        </p>
        <button onclick="handleLogout()" class="stripe-button" style="margin-top:10px">Logout</button>
    `;

    setInterval(updateTimer, 1000);
    updateTimer();
}

// Funcția care aplică vizibilitatea în timp real
function applySettings(shouldSave = true) {
    const toggles = document.querySelectorAll('#main-toggles input');
    const cards = document.querySelectorAll('.wrapper > .payment-card:not(#settings-card):not(#offline-card)');
    const offlineCard = document.getElementById('offline-card');
    const footer = document.querySelector('.footer-links');

    // DACĂ NU SUNTEM PE PAGINA PRINCIPALĂ (nu există toggles)
    // Afișăm cardurile normal
    if (toggles.length === 0) {
        cards.forEach(c => c.style.display = 'flex');
        return;
    }

    // LOGICA PENTRU PAGINA PRINCIPALĂ (cu butoane)
    let states = [];
    let anyActive = false;

    toggles.forEach((t, i) => {
        states.push(t.checked);
        if (cards[i]) {
            if (t.checked) {
                cards[i].style.display = 'flex';
                anyActive = true;
            } else {
                cards[i].style.display = 'none';
            }
        }
    });

    if (shouldSave) {
        localStorage.setItem('siteSettings', JSON.stringify(states));
    }

    // Verificăm butonul 4 (Colaborare)
    const isFourthOff = (toggles[3] && !toggles[3].checked);
    
    if (!anyActive || isFourthOff) {
        cards.forEach(c => c.style.display = 'none');
        if (offlineCard) offlineCard.style.display = 'flex';
        if (footer) footer.style.display = 'none';
    } else {
        if (offlineCard) offlineCard.style.display = 'none';
        if (footer) footer.style.display = 'block';
    }
}


// Funcția de toggle pentru butoane
function toggleCard(index, checkbox) {
    applySettings();
}

// Funcția pentru butonul rulment
function toggleSettings() {
    const sCard = document.getElementById('settings-card');
    if (sCard) {
        const isHidden = (sCard.style.display === 'none' || sCard.style.display === '');
        sCard.style.display = isHidden ? 'flex' : 'none';
    }
}

// La încărcare, ne asigurăm că totul pornește corect conform bifelor din HTML
window.onload = applySettings;


// 2. Funcția de inițializare (Cheia problemei tale)
function init() {
    const saved = localStorage.getItem('siteSettings');
    const toggles = document.querySelectorAll('#main-toggles input');
    
    if (saved && toggles.length > 0) {
        // DACĂ EXISTĂ ISTORIC: Restaurăm ce a ales utilizatorul data trecută
        const states = JSON.parse(saved);
        toggles.forEach((t, i) => {
            if (states[i] !== undefined) t.checked = states[i];
        });
    } else {
        // DACĂ NU EXISTĂ ISTORIC (Prima deschidere): Forțăm totul pe OFF
        toggles.forEach(t => t.checked = false);
    }
    
    // Aplicăm setările imediat (va ascunde site-ul dacă e prima dată sau dacă a fost lăsat offline)
    applySettings(false);
}

// Rulăm imediat ce s-a încărcat structura
document.addEventListener('DOMContentLoaded', init);

// Funcția pentru butoanele toggle din interfață
function toggleCard(index, checkbox) {
    applySettings(true);
}

// Funcția pentru rulment
function toggleSettings() {
    const sCard = document.getElementById('settings-card');
    if (sCard) {
        const isHidden = (sCard.style.display === 'none' || sCard.style.display === '');
        sCard.style.display = isHidden ? 'flex' : 'none';
    }
}



// 2. Această funcție rulează INSTANT, nu așteaptă încărcarea completă
function init() {
    const saved = localStorage.getItem('siteSettings');
    const toggles = document.querySelectorAll('#main-toggles input');
    
    if (saved) {
        const states = JSON.parse(saved);
        toggles.forEach((t, i) => {
            if (states[i] !== undefined) {
                t.checked = states[i]; // Suprascriem HTML-ul
            }
        });
    }
    applySettings(false);
}

// Executăm inițializarea
init();

// 3. Funcțiile pentru butoane (Rămân neschimbate)
function toggleCard(index, checkbox) {
    applySettings(true);
}

function toggleSettings() {
    const sCard = document.getElementById('settings-card');
    if (sCard) {
        sCard.style.display = (sCard.style.display === 'none' || sCard.style.display === '') ? 'flex' : 'none';
    }
}
