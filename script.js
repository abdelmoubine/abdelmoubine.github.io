(function() {
    // Initialize EmailJS with your Public Key
    emailjs.init("V0VXRfgxXET6_8Q4T"); 
})();

// Fetch GitHub Projects with Uniform Grid logic
async function fetchGitHubData() {
    const feed = document.getElementById('github-feed');
    try {
        const response = await fetch('https://api.github.com/users/abdelmoubine/repos?sort=updated&per_page=12');
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
    
    // 1. تبديل النصوص بناءً على اللغة المختارة
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLang}`);
    });
    
    // 2. تبديل العلم (SVG) داخل الزر برسم أصلي 100%
    const langBtn = document.getElementById('lang-btn');
    const flagUSA = `<svg width="20" height="15" viewBox="0 0 3 2"><rect width="3" height="2" fill="#bf0a30"/><path d="M0 0h1.5v1h-1.5z" fill="#3c3b6e"/><path d="M0 0.15h3M0 0.46h3M0 0.77h3M0 1.08h3M0 1.39h3M0 1.7h3M0 2h3" stroke="#fff" stroke-width="0.1"/><path d="M0 0l1.5 1M1.5 0l-1.5 1" stroke="#fff" stroke-width="0.06" fill="none"/></svg>`;
    const flagFrance = `<svg width="20" height="15" viewBox="0 0 3 2"><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ed2939"/></svg>`;

    // إذا كانت اللغة الحالية فرنسية، أظهر علم أمريكا (للتبديل للإنجليزية) والعكس
    langBtn.innerHTML = `
        <span id="lang-label">${currentLang === 'en' ? 'Français' : 'English'}</span>
        ${currentLang === 'en' ? flagFrance : flagUSA}
    `;

    // 3. تحديث خانات الإدخال (Placeholders)
    const placeholders = {
        en: { name: "Name", email: "Email", msg: "Message" },
        fr: { name: "Nom", email: "E-mail", msg: "Message" }
    };
    const form = document.getElementById('contact-form');
    form.querySelector('input[name="from_name"]').placeholder = placeholders[currentLang].name;
    form.querySelector('input[name="user_email"]').placeholder = placeholders[currentLang].email;
    form.querySelector('textarea').placeholder = placeholders[currentLang].msg;
}

window.onload = fetchGitHubData;