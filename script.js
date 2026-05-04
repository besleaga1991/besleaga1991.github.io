// Detecție Apple (macOS & iOS)
const isApple = /Mac|iPhone|iPod|iPad/.test(navigator.platform) ||
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if (isApple) {
    document.body.classList.add('apple-device');
}

const year = 2026;
const name = "Beșleagă Alexandru Marian";

// Copyright notice
if(document.getElementById('copyright-notice')) {
    document.getElementById('copyright-notice').innerText = `© ${year} ${name}. Toate drepturile rezervate.`;
}

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
