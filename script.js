// In script.js
async function loadJSON(path) {
    // Append a unique timestamp (t) to the path to force the browser 
    // to request a fresh copy of the JSON data every time.
    const uniquePath = path + "?t=" + new Date().getTime(); 
    
    const res = await fetch(uniquePath);
    return await res.json();
}

/* ---------------------------------------------------------
   FEATURED PROJECTS — ROW HEIGHT MATCHING
--------------------------------------------------------- */

// Render Featured Projects as top-image cards (2 per row)
function renderFeaturedProjects(projects) {
    let projHTML = `
        <h3>Featured Projects</h3>
        <div class="projects-grid">
    `;

    projects.list.forEach(p => {
        projHTML += `
            <div class="project-card" onclick="window.open('${p.link}', '_blank')">
                <img src="${p.image}" alt="${p.title}">
                <div class="project-info">
                    <h4>${p.title}</h4>
                    <p>${p.description || ""}</p>
                </div>
            </div>
        `;
    });

    // Add empty placeholder if odd number
    if (projects.list.length % 2 !== 0) {
        projHTML += `<div class="project-card empty"></div>`;
    }

    projHTML += `</div>`;
    document.getElementById("featuredProjectsSection").innerHTML = projHTML;

    // Equalize card heights within each row
    equalizeProjectCardRows();
}

// Equalize row heights
function equalizeProjectCardRows() {
    const cards = Array.from(document.querySelectorAll('.projects-grid .project-card'));

    cards.forEach(c => c.style.height = '');

    const rows = {};
    cards.forEach(card => {
        if (card.classList.contains('empty')) return;
        const top = Math.round(card.getBoundingClientRect().top);

        if (!rows[top]) rows[top] = [];
        rows[top].push(card);
    });

    Object.values(rows).forEach(rowCards => {
        let maxH = 0;

        rowCards.forEach(c => {
            const h = Math.round(c.getBoundingClientRect().height);
            if (h > maxH) maxH = h;
        });

        rowCards.forEach(c => {
            c.style.height = maxH + 'px';
        });
    });
}

// Debounced resize re-equalization
let _eqTimeout = null;
function onResizeDebounced() {
    if (_eqTimeout) clearTimeout(_eqTimeout);
    _eqTimeout = setTimeout(() => {
        equalizeProjectCardRows();
    }, 120);
}

window.addEventListener('resize', onResizeDebounced);


/* ---------------------------------------------------------
   MAIN BUILD FUNCTION
--------------------------------------------------------- */

/* ---------------------------------------------------------
   MAIN BUILD FUNCTION
--------------------------------------------------------- */

async function buildSite() {

    const hero       = await loadJSON("data/hero.json");
    const background = await loadJSON("data/background.json");
    const skills     = await loadJSON("data/skills.json");
    const projects   = await loadJSON("data/projects.json");
    const jams       = await loadJSON("data/gamejam.json");
    const journey    = await loadJSON("data/journey.json");
    const footer     = await loadJSON("data/footer.json");

    /* -----------------------------
       HERO
    ------------------------------ */
    document.getElementById("heroSection").innerHTML = `
        <div class="hero-photo">
            <img src="https://media.licdn.com/dms/image/v2/D5603AQHBuP7sCVUKEQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1687405584746?e=1766016000&v=beta&t=RAsNyOrey0tDl0QEPEpNXnwz6B6h9Yz55JTlzOYPVJA">
        </div>
        <div class="hero-text">
            <h1>${hero.line1}</h1>
            <h2>${hero.line2}</h2>
            <p>${hero.line3}</p>
        </div>
    `;

    /* -----------------------------
       BACKGROUND
    ------------------------------ */
    document.getElementById("backgroundSection").innerHTML = `
        <h3>Background</h3>
        <p>${background.text}</p>
    `;

    /* -----------------------------
       SKILLS
    ------------------------------ */
    document.getElementById("skillsSection").innerHTML = `
        <h3>Skills</h3>
        <div class="skill-grid">
            <div><strong>Languages</strong><div class="skill-list">${skills.languages.map(l => `<span class="skill-item">${l}</span>`).join("")}</div></div>
            <div><strong>Engines</strong><div class="skill-list">${skills.frameworks.map(f => `<span class="skill-item">${f}</span>`).join("")}</div></div>
            <div><strong>Tools</strong><div class="skill-list">${skills.tools.map(t => `<span class="skill-item">${t}</span>`).join("")}</div></div>
            <div><strong>Fields</strong><div class="skill-list">${skills.fields.map(f => `<span class="skill-item">${f}</span>`).join("")}</div></div>
        </div>
    `;

    /* -----------------------------
       FEATURED PROJECTS
    ------------------------------ */
    renderFeaturedProjects(projects);

    /* -----------------------------
       GAME JAMS (Updated with Description)
    ------------------------------ */
    let jamHTML = `<h3>Game Jam & Personal Projects</h3> <div class="jams-grid">`;
    jams.list.forEach(j => {
        jamHTML += `
            <div class="jam-card" onclick="window.open('${j.link}', '_blank')">
                <div class="jam-header">
                    <h4>${j.title}</h4>
                    <span class="arrow">↗</span>
                </div>
                <p>${j.description || ""}</p>
            </div>
        `;
    });
    jamHTML += `</div>`;
    document.getElementById("gamejamSection").innerHTML = jamHTML;

    /* -----------------------------
       JOURNEY (Updated with Description)
    ------------------------------ */
    let journeyHTML = `<h3>Journey</h3> <div class="journey-grid">`;
    journey.list.forEach(j => {
        journeyHTML += `
            <div class="journey-card">
                <div class="journey-left">
                    <h4>${j.years}</h4>
                </div>
                <div class="journey-right">
                    <p class="company"><strong>${j.company}</strong></p>
                    <p class="role">${j.role}</p>
                    <p class="desc">${j.description || ""}</p>
                </div>
            </div>
        `;
    });
    journeyHTML += `</div>`;
    document.getElementById("journeySection").innerHTML = journeyHTML;

    /* -----------------------------
       FOOTER
    ------------------------------ */
    document.getElementById("footerSection").innerHTML = `
      <div class="footer-icons">
          <a href="${footer.github}" target="_blank"><img src="assets/icons/github_logo_128.png"></a>
          <a href="${footer.linkedin}" target="_blank"><img src="assets/icons/linkedin_logo_128.png"></a>
          <a href="mailto:${footer.email}"><img src="assets/icons/mail_logo_128.png"></a>
      </div>
    `;
}

/* ---------------------------------------------------------
   RUN SITE BUILD
--------------------------------------------------------- */
buildSite();