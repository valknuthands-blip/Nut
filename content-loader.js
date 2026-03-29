(function() {
    const sections = [
        { id: 'home-section',        file: 'components/home.html' },
        { id: 'about-section',       file: 'components/about.html' },
        { id: 'logos-section',       file: 'components/logos.html' },
        { id: 'photography-section', file: 'components/photography.html' },
        { id: 'instagram-section',   file: 'components/instagram.html' },
        { id: 'animation-section',   file: 'components/animation.html' },
        { id: 'marketing-section',   file: 'components/marketing.html' },
        { id: 'dev-section',         file: 'components/dev.html' },
        { id: 'contact-section',     file: 'components/contact.html' },
        { id: 'footer-section',      file: 'components/footer.html' }
    ];

    async function loadAll() {
        for (let section of sections) {
            try {
                const response = await fetch(section.file);
                if (!response.ok) throw new Error(`Failed to load ${section.file}`);
                const html = await response.text();
                document.getElementById(section.id).innerHTML = html;
            } catch (e) {
                console.error(e);
            }
        }
        window.contentLoaded = true;
        document.dispatchEvent(new Event('content-loaded'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAll);
    } else {
        loadAll();
    }
})();