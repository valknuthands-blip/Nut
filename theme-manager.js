(function() {
    const STORAGE_KEY = 'vivash-theme';
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = themeToggle?.querySelector('.theme-icon-sun');
    const moonIcon = themeToggle?.querySelector('.theme-icon-moon');

    const themes = {
        dark: { css: 'css/dark.css', js: 'js/dark.js', icon: 'dark' },
        light: { css: 'css/white.css', js: 'js/white.js', icon: 'light' }
    };

    let currentTheme = localStorage.getItem(STORAGE_KEY) || 'dark';
    let loadedCSS = null;
    let loadedJS = null;

    function setThemeIcon(theme) {
        if (!sunIcon || !moonIcon) return;
        if (theme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    function loadTheme(themeName) {
        const theme = themes[themeName];
        if (!theme) return;

        // Remove previous CSS/JS and call destroy
        if (loadedJS && window.__currentTheme?.destroy) {
            window.__currentTheme.destroy();
        }
        if (loadedCSS) loadedCSS.remove();
        if (loadedJS) loadedJS.remove();

        window.__currentTheme = null;

        // Load new CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = theme.css;
        document.head.appendChild(link);
        loadedCSS = link;

        // Load new JS
        const script = document.createElement('script');
        script.src = theme.js;
        script.onload = () => {
            if (window.__currentTheme?.init) {
                window.__currentTheme.init();
            }
        };
        document.body.appendChild(script);
        loadedJS = script;

        setThemeIcon(themeName);
        localStorage.setItem(STORAGE_KEY, themeName);
        currentTheme = themeName;
    }

    function initTheme() {
        if (window.contentLoaded) {
            loadTheme(currentTheme);
        } else {
            document.addEventListener('content-loaded', () => loadTheme(currentTheme));
        }
    }

    themeToggle?.addEventListener('click', () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        loadTheme(newTheme);
    });

    initTheme();
})();