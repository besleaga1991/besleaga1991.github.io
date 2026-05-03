//
//  script.js
//  Website
//
//  Created by Besleaga Alexandru Marian on 03/05/2026.
//

const year = 2026;
const name = "Beșleagă Alexandru Marian";
document.getElementById('copyright-notice').innerText = `© ${year} ${name}. Toate drepturile rezervate.`;

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

