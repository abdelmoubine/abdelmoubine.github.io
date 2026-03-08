(function() {
    emailjs.init("V0VXRfgxXET6_8Q4T"); 
})();

let currentPage = 1;
const perPage = 4; // 4 projects per page (2 per row)

// Set English as default language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Ensure English is active by default
    document.documentElement.lang = 'en';
    
    // Update all text elements to English
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = element.getAttribute('data-en');
    });
    
    // Update language button to show French flag
    const langBtn = document.getElementById('lang-btn');
    const flagFrance = `<svg width="20" height="15" viewBox="0 0 3 2"><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ed2939"/></svg>`;
    langBtn.innerHTML = `<span id="lang-label">Français</span>${flagFrance}`;
    
    // Fetch GitHub projects
    fetchGitHubData(1);
});

async function fetchGitHubData(page = 1) {
    const feed = document.getElementById('github-feed');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumDisplay = document.getElementById('page-number');

    try {
        const response = await fetch(`https://api.github.com/users/abdelmoubine/repos?sort=updated&per_page=${perPage}&page=${page}`);
        const repos = await response.json();
        
        feed.innerHTML = '';
        repos.forEach(repo => {
            // Format description
            const description = repo.description 
                ? (repo.description.length > 80 
                    ? repo.description.substring(0, 80) + '...' 
                    : repo.description)
                : (document.documentElement.lang === 'en' 
                    ? 'No description available' 
                    : 'Aucune description disponible');
            
            // Format stars count
            const stars = repo.stargazers_count || 0;
            const starText = stars === 1 ? 'star' : 'stars';
            
            const card = document.createElement('div');
            card.className = 'p-card';
            card.innerHTML = `
                <div style="height: 100%; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="color:var(--accent); font-size:1.2rem; margin:0; text-transform: capitalize;">
                            ${repo.name.replace(/-/g, ' ')}
                        </h4>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: #fbbf24;">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span style="color:var(--dim); font-size:0.9rem;">${stars} ${starText}</span>
                        </div>
                    </div>
                    <p style="color:var(--dim); font-size:0.9rem; flex-grow: 1; margin-bottom: 20px;">
                        ${description}
                    </p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
                        ${repo.language ? `<span class="tag" style="font-size:0.7rem;">${repo.language}</span>` : ''}
                    </div>
                    <a href="${repo.html_url}" target="_blank" style="color:#fff; text-decoration:none; font-weight:600; border-bottom:2px solid var(--accent); width:fit-content; font-size:0.8rem; margin-top: auto;">
                        ${document.documentElement.lang === 'en' ? 'View Repository →' : 'Voir le dépôt →'}
                    </a>
                </div>
            `;
            feed.appendChild(card);
        });

        currentPage = page;
        pageNumDisplay.innerText = `${document.documentElement.lang === 'en' ? 'Page' : 'Page'} ${currentPage}`;
        prevBtn.disabled = (currentPage === 1);
        nextBtn.disabled = (repos.length < perPage);
        
        // Update button text based on language
        prevBtn.textContent = document.documentElement.lang === 'en' ? 'Previous' : 'Précédent';
        nextBtn.textContent = document.documentElement.lang === 'en' ? 'Next' : 'Suivant';
        
    } catch (err) { 
        console.error("Error fetching GitHub data");
        feed.innerHTML = `<p style="color:var(--dim); text-align:center;">${document.documentElement.lang === 'en' ? 'Error loading projects' : 'Erreur lors du chargement des projets'}</p>`;
    }
}

function changePage(step) { 
    fetchGitHubData(currentPage + step); 
}

function toggleLanguage() {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    document.documentElement.lang = newLang;
    
    // Update all text elements with data-en/data-fr
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${newLang}`);
    });
    
    // Update language button flag and label
    const langBtn = document.getElementById('lang-btn');
    const flagUSA = `<svg width="20" height="15" viewBox="0 0 3 2"><rect width="3" height="2" fill="#bf0a30"/><path d="M0 0h1.5v1h-1.5z" fill="#3c3b6e"/><path d="M0 0.15h3M0 0.46h3M0 0.77h3M0 1.08h3M0 1.39h3M0 1.7h3M0 2h3" stroke="#fff" stroke-width="0.1"/><path d="M0 0l1.5 1M1.5 0l-1.5 1" stroke="#fff" stroke-width="0.06" fill="none"/></svg>`;
    const flagFrance = `<svg width="20" height="15" viewBox="0 0 3 2"><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ed2939"/></svg>`;

    langBtn.innerHTML = `
        <span id="lang-label">${newLang === 'en' ? 'Français' : 'English'}</span>
        ${newLang === 'en' ? flagFrance : flagUSA}
    `;
    
    // Update available badge text
    const availableText = document.getElementById('available-text');
    if (availableText) {
        availableText.textContent = availableText.getAttribute(`data-${newLang}`);
    }
    
    // Refresh GitHub projects with new language
    fetchGitHubData(currentPage);
}

// EmailJS form submission
window.onload = function() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = document.documentElement.lang === 'en' ? 'Sending...' : 'Envoi en cours...';
        submitBtn.disabled = true;
        
        emailjs.sendForm('default_service', 'template_id', this)
            .then(() => {
                alert(document.documentElement.lang === 'en' 
                    ? 'Message sent successfully!' 
                    : 'Message envoyé avec succès!');
                this.reset();
            }, (error) => {
                alert(document.documentElement.lang === 'en' 
                    ? 'Failed to send message. Please try again.' 
                    : 'Échec de l\'envoi. Veuillez réessayer.');
                
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
};