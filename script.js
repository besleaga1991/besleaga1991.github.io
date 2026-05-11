// --- CONFIGURARE ȘI DETECTARE DISPOZITIV ---
const isApple = /Mac|iPhone|iPod|iPad/.test(navigator.platform) ||
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if (isApple) { document.body.classList.add('apple-device'); }

const year = 2026;
const name = "Beșleagă Alexandru Marian";

// --- FUNCȚIA CENTRALĂ DE PORNIRE ---
function startup() {
    const cp = document.getElementById('copyright-notice');
    if(cp) cp.innerText = `© ${year} ${name}. Toate drepturile rezervate.`;

    const storedData = localStorage.getItem('userAccount');
    const session = localStorage.getItem('userSession');

    if (storedData) {
        const user = JSON.parse(storedData);
        const now = new Date().getTime();
        if (now < user.expiresAt) {
            if (session === 'active') {
                startDashboard(user);
            }
        } else {
            localStorage.removeItem('userAccount');
            localStorage.removeItem('userSession');
        }
    }

    const savedSettings = localStorage.getItem('siteSettings');
    const toggles = document.querySelectorAll('#main-toggles input');
    
    if (toggles.length > 0) {
        if (savedSettings) {
            const states = JSON.parse(savedSettings);
            toggles.forEach((t, i) => { if (states[i] !== undefined) t.checked = states[i]; });
        } else {
            toggles.forEach(t => t.checked = true);
        }
    }
    applySettings(false);

    const savedLegal = localStorage.getItem('legalSettings');
    const legalToggles = document.querySelectorAll('#legal-toggles input');
    if (savedLegal && legalToggles.length > 0) {
        const states = JSON.parse(savedLegal);
        legalToggles.forEach((t, i) => { if (states[i] !== undefined) t.checked = states[i]; });
    }
    applyLegalVisibility(false);
}

document.addEventListener('DOMContentLoaded', startup);

// --- LOGICA DE AUTENTIFICARE ---
async function handleRegister() {
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const passConfirm = document.getElementById('reg-pass-confirm').value;

    if (!email || !pass || !passConfirm) { alert("Te rugăm să completezi toate câmpurile."); return; }
    if (pass !== passConfirm) { alert("Parolele nu coincid!"); return; }

    try {
        const response = await fetch(`${sbUrl}/rest/v1/users_profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Prefer': 'return=representation'
            },
            // MODIFICAT: Trimitem doar email și password, fără profile_image
            body: JSON.stringify({ email: email, password: pass })
        });

        if (response.status === 201 || response.ok) {
            alert("Cont creat cu succes!");
            window.location.href = 'index.html';
        } else {
            const errData = await response.json().catch(() => ({}));
            if(errData.code === "23505") {
                alert("Acest email este deja înregistrat în baza de date.");
            } else {
                alert("Eroare la înscriere: " + (errData.message || response.statusText));
            }
        }
    } catch (err) {
        console.error(err);
        alert("Eroare de rețea la înscriere.");
    }
}

async function handleLogin() {
    const emailInput = document.getElementById('login-email').value.trim();
    const passInput = document.getElementById('login-pass').value;

    if (!emailInput || !passInput) { alert("Te rugăm să completezi ambele câmpuri."); return; }

    try {
        const res = await fetch(`${sbUrl}/rest/v1/users_profiles?email=eq.${encodeURIComponent(emailInput)}&password=eq.${encodeURIComponent(passInput)}&select=*`, {
            method: 'GET',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            alert("Eroare la conectare cu baza de date.");
            return;
        }

        const data = await res.json();
        if (data && data.length > 0) {
            const user = data[0]; // Extreagem primul utilizator găsit în tabelă
            
            localStorage.setItem('userSession', 'active');
            localStorage.setItem('loggedUserEmail', user.email);
            localStorage.setItem('loggedUserId', user.id);
            
            window.location.href = 'dashboard.html';
        } else {
            alert("Email sau parolă incorectă.");
        }
    } catch (e) {
        console.error(e);
        alert("Eroare de conexiune la autentificare.");
    }
}

function startDashboard(user) {
    window.location.href = 'dashboard.html';
}

function handleLogout() {
    localStorage.removeItem('userSession');
    location.reload();
}

function applySettings(shouldSave = true) {
    const toggles = document.querySelectorAll('#main-toggles input');
    
    // Selectăm elementele exact în ordinea toggle-urilor din interfață
    const elementsToToggle = [
        document.getElementById('reveal-wrapper'), // 1. Website Conținut + Iconițe
        document.querySelector('.payment-card:not(#auth-card):not(#offline-card):nth-of-type(2)'), // 2. Website Basic
        document.querySelector('.payment-card:not(#auth-card):not(#offline-card):nth-of-type(3)'), // 3. Curriculum Vitae
        document.getElementById('auth-card') // 4. Colaborare
    ];

    // Dacă selecția de mai sus e fragilă, folosim căutarea prin text (Fallback)
    const allCards = document.querySelectorAll('.payment-card');
    const basicCard = Array.from(allCards).find(c => c.innerText.includes('3.000,00 RON')) || elementsToToggle;
    const cvCard = Array.from(allCards).find(c => c.innerText.includes('25,00 RON')) || elementsToToggle;

    const finalElements = [
        document.getElementById('reveal-wrapper'),
        basicCard,
        cvCard,
        document.getElementById('auth-card')
    ];

    const offlineCard = document.getElementById('offline-card');
    const footer = document.querySelector('.footer-links');

    if (!toggles || toggles.length === 0) return;

    let states = [];
    let anyActive = false;

    toggles.forEach((t, i) => {
        states.push(t.checked); // Colectăm starea pentru salvare
        if (finalElements[i]) {
            finalElements[i].style.display = t.checked ? 'flex' : 'none';
            if (t.checked) anyActive = true;
        }
    });

    // SALVARE ÎN LOCAL STORAGE (Forțată)
    if (shouldSave) {
        localStorage.setItem('siteSettings', JSON.stringify(states));
    }

    // Logica ecranului Offline
    if (!anyActive) {
        if (offlineCard) offlineCard.style.display = 'flex';
        if (footer) footer.style.display = 'none';
    } else {
        if (offlineCard) offlineCard.style.display = 'none';
        if (footer) footer.style.display = 'block';
    }
}

function toggleCard(index, checkbox) { applySettings(true); }

function toggleSettings() {
    const sCard = document.getElementById('settings-card');
    if (sCard) sCard.style.display = (sCard.style.display === 'none' || sCard.style.display === '') ? 'flex' : 'none';
}

function toggleLegalSettings() {
    const sCard = document.getElementById('legal-settings-card');
    if (sCard) sCard.style.display = (sCard.style.display === 'none' || sCard.style.display === '') ? 'flex' : 'none';
}

function applyLegalVisibility(shouldSave = true) {
    const toggles = document.querySelectorAll('#legal-toggles input');
    const ids = ['link-terms', 'link-privacy', 'link-gdpr', 'link-security', 'link-contact'];
    let states = [];
    toggles.forEach((t, i) => {
        states.push(t.checked);
        const el = document.getElementById(ids[i]);
        if(el) el.style.display = t.checked ? 'inline' : 'none';
    });
    if(shouldSave) localStorage.setItem('legalSettings', JSON.stringify(states));
}

// --- TOATE TEXTELE LEGALE INTACTE ---
function showLegal(type) {
    const modal = document.getElementById('legalModal');
    const content = document.getElementById('legalText');
    
    // Optimizarea eliminării înălțimilor maxime pentru funcționarea scroll-ului nativ pe ecranul iPhone-ului
    content.style.maxHeight = 'none';
    content.style.overflowY = 'visible';

    // Fundație tip card standardizată pentru restul ferestrelor (fără umbră inline)
    let cardWrapperStart = `<div style="display: flex; flex-direction: column; align-items: center; width: 100%; gap: 20px; padding-bottom: 30px;">
                            <div class="payment-card" style="text-align: left; width: 100%; max-width: 400px; margin-bottom: 0; flex-shrink: 0; box-shadow: none !important;">`;
    
    // MODIFICARE CONFIRMATĂ: Un singur buton „Am înțeles” adăugat nativ în interiorul cardurilor
    let cardWrapperEnd = `<button class="close-button" onclick="closeModal()" style="margin-top: 25px; width: 100%;">Am înțeles</button></div></div>`;
    
    if(type === 'terms') {
        content.innerHTML = cardWrapperStart + `
            <h2>Termeni și Condiții</h2>
            <div class="legal-text-body" style="margin-bottom: 25px;">
                <strong>1. Definiția „Website”:</strong> Produsul final reprezintă o colecție organizată de texte și imagini, structurată corespunzător conform cerințelor solicitate de client. <br><br>
                <strong>2. Structura Tehnică:</strong><br>
                • <strong>Header:</strong> Secțiunea superioară (navigare și logo).<br>
                • <strong>Body:</strong> Conținutul principal al paginilor.<br>
                • <strong>Footer:</strong> Secțiunea inferioară pentru date legale.<br><br>
                <strong>3. Specificații:</strong> Include între 1 și 5 pagini, meniu, conținut, Termeni și Condiții și Politica de Confidențialitate.<br><br>
                <strong>4. Livrare:</strong> Plata reprezintă acceptul începerii lucrului. Termenul de livrare este de <strong>31 de zile</strong>, produsul fiind predat la sfârșitul primei luni de activitate (începutul lunii a doua).
            </div>
        ` + cardWrapperEnd;
    } else if(type === 'privacy') {
        content.innerHTML = cardWrapperStart + `
            <h2>Politică de Confidențialitate</h2>
            <div class="legal-text-body" style="margin-bottom: 25px;">
                Datele sunt procesate securizat prin Stripe. Nu stocăm informații bancare; toate plățile sunt gestionate prin <strong>Power of Stripe</strong>.<br><br>
                Acest serviciu respectă normele impuse de <span style="color:var(--stripe-blue);cursor:pointer;text-decoration:underline" onclick="showLegal('law')">Legea 365/2002</span> privind comerțul electronic.<br><br>
                E-mailul dvs. este folosit doar pentru facturare și comunicare tehnică.
            </div>
        ` + cardWrapperEnd;
    } else if(type === 'gdpr') {
        content.innerHTML = cardWrapperStart + `
            <h2>Protecția Datelor (GDPR)</h2>
            <div class="legal-text-body" style="margin-bottom: 25px;">
                Conform <strong>Regulamentului (UE) 2016/679 (GDPR)</strong>, vă informăm asupra drepturilor privind protecția datelor cu caracter personal:<br><br>
                <strong>1. Drepturile Persoanei Vizate:</strong> Aveți dreptul de acces la date (Art. 15), dreptul la rectificare (Art. 16), dreptul la ștergerea datelor (Art. 17) și dreptul la restricționarea prelucrării (Art. 18).<br><br>
                <strong>2. Temeiul Juridic:</strong> Prelucrarea este necesară pentru executarea unui contract la care persoana vizată este parte sau pentru a face demersuri la cererea persoanei vizate înainte de încheierea unui contract (Art. 6, alin. 1, lit. b).<br><br>
                <strong>3. Portabilitatea și Opoziția:</strong> Aveți dreptul de a primi datele într-un format structurat și dreptul de a vă opune prelucrării în orice moment din motive legate de situația dvs. particulară.<br><br>
                <strong>4. Autoritatea de Supraveghere:</strong> Aveți dreptul de a depune o plângere la ANSPDCP în cazul în care considerați că prelucrarea încalcă prevederile legale în vigoare.
            </div>
        ` + cardWrapperEnd;
    } else if(type === 'security') {
        content.innerHTML = cardWrapperStart + `
            <h2>Securitate</h2>
            <div class="legal-text-body" style="margin-bottom: 25px;">
                Sigranța datelor este integrată în ecosistemul nostru de lucru. În conformitate cu politicile de protecție a informațiilor, utilizăm exclusiv siateme de operare <strong>iOS, macOS, watchOS,tvOS și visionOS </strong> pentru prelucrarea datelor cu caracter personal ale clienților.<br><br>
                <strong>Angajamentul de securitate:</strong><br>
                • Processarea se realizează într-un mediu controlat, beneficiind de criptarea nativă a dispozitivelor Apple.<br>
                • Standardele de securitate aplicate sunt conforme cu cerințele tehnice prezentate pe <a href="https://apple.com" target="_blank" style="color: var(--stripe-blue)">https://apple.com</a>.<br>
                • Datele dvs. sunt accesate și gestionate prin protocoale stricte de autentificare pentru a preveni orice intervenție neautorizată.<br><br>
                Prin accesarea serviciilor noastre, vă exprimați consimțământul pentru gestionarea informațiilor în acest cadru tehnologic securizat.
            </div>
        ` + cardWrapperEnd;
    } else if(type === 'law') {
        content.innerHTML = cardWrapperStart + `
            <h2>Legea 365/2002</h2>
            <div class="legal-text-body" style="margin-bottom: 25px;">
                <strong>Art. 4: Libera circulație</strong> - Furnizarea de servicii ale societății informaționale este liberă și nu este supusă niciunei autorizări prealabile.<br><br>
                <strong>Art. 7: Informarea consumatorului</strong> - Prestatorul area obligația de a afișa datele de identificare, e-mailul și tarifele serviciilor.<br><br>
                <strong>Art. 9: Contracte electronice</strong> - Contractele încheiate prin mijloace electronice produc toate efectele legale ale unui contract sub semnătură privată.<br><br>
                <span style="color:var(--stripe-blue);cursor:pointer;text-decoration:underline" onclick="showLegal('fiscal')">Consultă obligațiile fiscale (ANAF)</span>
            </div>
        ` + cardWrapperEnd;
    } else if(type === 'fiscal') {
        content.innerHTML = cardWrapperStart + `
            <h2>Obligații Fiscale (ANAF)</h2>
            <div class="legal-text-body" style="margin-bottom: 25px;">
                <strong>Conform Codului Fiscal (Legea 227/2015):</strong><br><br>
                <strong>Art. 120:</strong> Prestatorul are obligația de a depune <strong>Declarația Unică</strong> privind impozitul pe venit și contribuțiile sociale datorate de persoanele fizice.<br><br>
                <strong>Art. 122:</strong> Veniturile nete din activități independente sunt supuse impozitării și contribuțiilor (CAS, CASS) conform plafoanelor legale.<br><br>
                Monitorizarea electronică a plăților asigură transparența totală a veniturilor raportate către bugetul de stat.
            </div>
        ` + cardWrapperEnd;
    } else if(type === 'contact') {
        content.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; width: 100%; gap: 20px;">
                
                <!-- PRIMUL CARD: Contact -->
                <div class="payment-card" style="text-align: left; width: 100%; max-width: 400px; margin-bottom: 0; flex-shrink: 0; box-shadow: none !important;">
                    <h1>Contact</h1>
                    <div style="color: var(--text-light); font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
                        <strong>Nume:</strong> ${name}<br>
                        <strong>E-mail:</strong> <a href="mailto:besleaga.1991@icloud.com" style="color: var(--stripe-blue)">besleaga.1991@icloud.com</a><br>
                        <strong>Telefon:</strong> +40 725 500 865<br><br>
                        <strong>Adrese:</strong> Str. Foișorului Nr. 4 / Bvd. Pipera Tunari 152-156
                    </div>
                    <button class="close-button" onclick="closeModal()">Am înțeles</button>
                </div>

                <!-- AL DOILEA CARD: Doar Solicitare Date -->
                <div class="payment-card" style="text-align: left; width: 100%; max-width: 400px; margin-bottom: 0; flex-shrink: 0; box-shadow: none !important;">
                    <h1>Solicitare Date</h1>
                    
                    <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 20px;">
                        <label style="font-size: 12px; color: var(--text-light);">Nume și Prenume</label>
                        <input type="text" id="db-nume" placeholder="Popescu Ion" class="form-input">
                        
                        <label style="font-size: 12px; color: var(--text-light);">Adresa</label>
                        <input type="text" id="db-adresa" placeholder="Strada, Număr, Oraș" class="form-input">
                        
                        <label style="font-size: 12px; color: var(--text-light);">Număr de Telefon</label>
                        <input type="tel" id="db-telefon" placeholder="07xx xxx xxx" class="form-input">
                        
                        <label style="font-size: 12px; color: var(--text-light);">E-mail</label>
                        <input type="email" id="db-email" placeholder="nume@exemplu.com" class="form-input">
                        
                        <button onclick="saveLeadToDatabase()" id="btn-save-lead" class="stripe-button" style="width: 100%; margin-top: 15px;">Trimite Datele</button>
                        <p id="save-status" style="font-size: 11px; text-align: center; margin-top: 10px; color: var(--text-light);"></p>
                    </div>
                </div>
            </div>
        `;

        // Curățare forțată a butoanelor fantomă orfane de sub carduri din HTML
        const extraButtons = document.querySelectorAll('#legalModal > .modal-content-wrapper > .close-button, #legalModal .legal-card > .close-button');
        extraButtons.forEach(btn => {
            if (!btn.closest('.payment-card')) btn.style.display = 'none';
        });
    }
    
    modal.style.display = 'block';
    
    // Forțăm modalul să preia scroll-ul general nativ pe iPhone
    modal.style.overflowY = 'auto';
    modal.style.webkitOverflowScrolling = 'touch';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('legalModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.overflowY = '';
    }
    document.body.style.overflow = 'auto';
}

window.addEventListener('keydown', (e) => { if (e.key === "Escape") closeModal(); });

// --- PENTRU EFECTUL DE GLISARE ȘI VIBRAȚIE PE CARD ---
document.addEventListener('DOMContentLoaded', () => {
    const mainCard = document.getElementById('content-card');
    if (mainCard) {
        mainCard.addEventListener('click', function(e) {
            if (e.target.closest('a') || e.target.closest('button')) return;

            // Dacă cardul nu este deschis, îl deschidem și vibrăm
            if (!this.classList.contains('revealed')) {
                this.classList.add('revealed');

                if (isApple) {
                    // Așteptăm să se termine glisarea (400ms)
                    setTimeout(() => {
                        this.classList.add('vibrate-active');
                        if ("vibrate" in navigator) navigator.vibrate(30);

                        // Oprim DOAR vibrația, cardul RĂMÂNE în stânga
                        setTimeout(() => {
                            this.classList.remove('vibrate-active');
                        }, 300);
                    }, 400);
                }
            } else {
                // Dacă este deja deschis, la al doilea click îl închidem
                this.classList.remove('revealed');
                this.classList.remove('vibrate-active');
            }
        });
    }
});

// --- CONFIGURARE SUPABASE REST ---
const sbUrl = 'https://bsybhrxzkdrwsewjolcy.supabase.co';
const sbKey = 'sb_publishable_horRgs5_HGfPpHoP9uRF7w_l2t08kX6';

// Funcție utilitară pentru a bloca butonul vizual
function disableButtonVisuals(btn) {
    btn.innerText = "Înregistrat";
    btn.style.backgroundColor = "#e6ebf1";
    btn.style.color = "#aab7c4";
    btn.style.cursor = "not-allowed";
    btn.disabled = true;
}

async function fetchGlobalClicks() {
    const display = document.getElementById('click-display');
    if (!display) return;

    try {
        const res = await fetch(`${sbUrl}/rest/v1/stats?name=eq.main_card_clicks&select=click_count`, {
            method: 'GET',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        if (data && data.length > 0) {
            display.innerText = data[0].click_count;
        }
    } catch (e) {
        console.error("Sincronizare eșuată:", e);
    }
}

async function handleCounterClick() {
    const btn = document.getElementById('counter-button');
    const display = document.getElementById('click-display');

    if (btn.disabled || localStorage.getItem('hasClicked')) return;

    btn.innerText = "Se trimite...";
    btn.disabled = true;

    try {
        const response = await fetch(`${sbUrl}/rest/v1/rpc/increment_clicks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`
            },
            body: JSON.stringify({ row_name: 'main_card_clicks' })
        });

        if (response.ok) {
            const currentVal = parseInt(display.innerText) || 0;
            display.innerText = currentVal + 1;

            // Salvează în local storage și blochează butonul
            localStorage.setItem('hasClicked', 'true');
            disableButtonVisuals(btn);
        } else {
            btn.innerText = "Eroare!";
            btn.disabled = false;
        }
    } catch (err) {
        console.error(err);
        btn.innerText = "Eroare rețea";
        btn.disabled = false;
    }
}

// Inițializare la încărcarea paginii
document.addEventListener('DOMContentLoaded', () => {
    fetchGlobalClicks();
    
    const btn = document.getElementById('counter-button');
    // Verificăm dacă utilizatorul a votat deja în trecut
    if (localStorage.getItem('hasClicked') === 'true' && btn) {
        disableButtonVisuals(btn);
    }
});

setInterval(fetchGlobalClicks, 10000);

async function saveLeadToDatabase() {
    const btn = document.getElementById('btn-save-lead');
    const cardContent = btn.closest('.payment-card'); // Identificăm cardul al doilea
    
    const data = {
        full_name: document.getElementById('db-nume').value.trim(),
        address: document.getElementById('db-adresa').value.trim(),
        phone: document.getElementById('db-telefon').value.trim(),
        email: document.getElementById('db-email').value.trim()
    };

    if (!data.full_name || !data.email) {
        alert("Numele și Email-ul sunt obligatorii.");
        return;
    }

    btn.innerText = "Se trimite...";
    btn.disabled = true;

    try {
        const response = await fetch(`${sbUrl}/rest/v1/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Înlocuim conținutul din cardul al doilea cu bifa de succes
            cardContent.innerHTML = `
                <div style="text-align: center; padding: 40px 0;">
                    <h1 style="color: #3ecf8e;">✔</h1>
                    <p style="font-size: 18px; color: var(--text-dark); font-weight: 600;">Mulțumim pentru date.</p>
                </div>
            `;
            
            // Închidem tot modalul automat după 3 secunde
            setTimeout(() => { closeModal(); }, 3000);
        } else {
            throw new Error();
        }
    } catch (err) {
        btn.innerText = "Eroare rețea";
        btn.disabled = false;
    }
}
