(function() {
    const STORAGE_KEY = 'vivash-theme';
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = themeToggle?.querySelector('.theme-icon-sun');
    const moonIcon = themeToggle?.querySelector('.theme-icon-moon');

    const themes = {
        dark:  { css: 'css/dark.css',  js: 'js/dark.js',  icon: 'dark'  },
        light: { css: 'css/white.css', js: 'js/white.js', icon: 'light' }
    };

    // Determine initial theme:
    // 1. Use saved preference if present
    // 2. Otherwise detect system preference
    function detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    let currentTheme = saved ? saved : detectSystemTheme();

    let loadedCSS = null;
    let loadedJS  = null;

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

        // Destroy previous theme JS
        if (loadedJS && window.__currentTheme?.destroy) {
            window.__currentTheme.destroy();
        }
        if (loadedCSS) loadedCSS.remove();
        if (loadedJS)  loadedJS.remove();
        window.__currentTheme = null;

        // Apply new CSS
        const link = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = theme.css;
        document.head.appendChild(link);
        loadedCSS = link;

        // Apply new JS
        const script = document.createElement('script');
        script.src = theme.js;
        script.onload = () => {
            if (window.__currentTheme?.init) {
                window.__currentTheme.init();
            }
        };
        document.body.appendChild(script);
        loadedJS = script;

        // Update toggle visual state
        if (themeToggle) {
            if (themeName === 'light') {
                themeToggle.classList.add('light');
            } else {
                themeToggle.classList.remove('light');
            }
        }
        setThemeIcon(themeName);

        // Persist choice
        localStorage.setItem(STORAGE_KEY, themeName);
        currentTheme = themeName;
    }

    function initTheme() {
        const doLoad = () => loadTheme(currentTheme);
        if (window.contentLoaded) {
            doLoad();
        } else {
            document.addEventListener('content-loaded', doLoad);
        }
    }

    // Manual toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            loadTheme(newTheme);
        });
    }

    // Listen for system preference changes (when user hasn't manually chosen)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user has never manually saved a preference
            if (!localStorage.getItem(STORAGE_KEY)) {
                loadTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    initTheme();
})();
