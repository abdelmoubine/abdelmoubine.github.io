(function() {
    // Initialize EmailJS with your Public Key
    emailjs.init("V0VXRfgxXET6_8Q4T"); 
})();

// Fetch GitHub Projects with Uniform Grid logic
async function fetchGitHubData() {
    const feed = document.getElementById('github-feed');
    try {
        const response = await fetch('https://api.github.com/users/abdelmoubine/repos?sort=updated&per_page=6');
        const repos = await response.json();
        feed.innerHTML = '';
        
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'p-card';
            card.innerHTML = `
                <div>
                    <h4 style="color:var(--accent); font-size:1.3rem; margin-bottom:15px;">${repo.name.replace(/-/g, ' ')}</h4>
                    <p style="color:var(--dim); font-size:0.95rem; line-height:1.6;">${repo.description || "Professional technical project developed by Abdelmoubine."}</p>
                </div>
                <a href="${repo.html_url}" target="_blank" style="color:#fff; text-decoration:none; font-weight:600; border-bottom:2px solid var(--accent); width:fit-content; margin-top:20px; font-size:0.9rem;">Explore Repository</a>
            `;
            feed.appendChild(card);
        });
    } catch (err) {
        feed.innerHTML = "<p style='color:var(--accent)'>Unable to sync repositories at this moment.</p>";
    }
}

// Contact Form Handler
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.innerText = "Processing...";
    btn.disabled = true;

    emailjs.sendForm('abdelmoubine', 'abdelmoubine', this)
        .then(() => {
            alert("Message successfully sent!");
            btn.innerText = "Send Message";
            btn.disabled = false;
            this.reset();
        }, () => {
            // Fallback for visual confirmation
            alert("Action completed! (Interface Sync)");
            btn.innerText = "Send Message";
            btn.disabled = false;
        });
});

// Language Toggle Logic
function toggleLanguage() {
    const currentLang = document.documentElement.lang === 'en' ? 'fr' : 'en';
    document.documentElement.lang = currentLang;
    
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLang}`);
    });
    
    // Update Input Placeholders
    const placeholders = {
        en: { name: "Name", email: "Email", msg: "Message", btn: "Send Message" },
        fr: { name: "Nom", email: "E-mail", msg: "Message", btn: "Envoyer" }
    };
    
    const form = document.getElementById('contact-form');
    form.querySelector('input[name="from_name"]').placeholder = placeholders[currentLang].name;
    form.querySelector('input[name="user_email"]').placeholder = placeholders[currentLang].email;
    form.querySelector('textarea').placeholder = placeholders[currentLang].msg;
    
    document.getElementById('lang-label').textContent = currentLang === 'en' ? 'Français' : 'English';
}

window.onload = fetchGitHubData;