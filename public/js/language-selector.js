/**
 * Lixsa Language Selector — Investor Deck
 * Renders a footer dropdown and handles cross-locale navigation.
 * Stores user preference in localStorage.
 */
(function () {
    'use strict';

    // ── Route Map ──────────────────────────────────────────────────────────
    var ROUTE_MAP = {
        paper: { es: 'investor/paper', en: 'investor/paper' }
    };

    var SUPPORTED_LANGS = ['es', 'en'];
    var LS_KEY = 'lixsa_lang';

    var LANG_LABELS = {
        es: { flag: '🇪🇸', label: 'Español' },
        en: { flag: '🇬🇧', label: 'English' }
    };

    // ── Helpers ────────────────────────────────────────────────────────────

    function detectCurrentLocale() {
        var pathSegments = window.location.pathname.replace(/^\//, '').split('/');
        for (var i = 0; i < pathSegments.length; i++) {
            if (SUPPORTED_LANGS.indexOf(pathSegments[i]) !== -1) return pathSegments[i];
        }
        return null;
    }

    function buildUrl(targetLang) {
        var currentLocale = detectCurrentLocale() || 'es';
        var pathname = window.location.pathname;
        // Simple replacement: swap the locale segment
        var newPath = pathname.replace('/' + currentLocale + '/', '/' + targetLang + '/');
        return newPath;
    }

    // ── Render ─────────────────────────────────────────────────────────────

    function renderSelector() {
        var currentLocale = detectCurrentLocale() || 'es';
        var info = LANG_LABELS[currentLocale] || LANG_LABELS.es;

        // Container
        var container = document.createElement('div');
        container.id = 'lixsa-lang-selector';
        container.className = 'lang-selector';

        // Trigger button
        var trigger = document.createElement('button');
        trigger.className = 'lang-selector__trigger';
        trigger.setAttribute('aria-label', 'Select language');
        trigger.innerHTML = '<span class="lang-selector__globe" style="display:flex; align-items:center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></span><span class="lang-selector__label">' + info.flag + ' ' + currentLocale.toUpperCase() + '</span><span class="lang-selector__arrow">▾</span>';
        container.appendChild(trigger);

        // Dropdown
        var dropdown = document.createElement('div');
        dropdown.className = 'lang-selector__dropdown';

        for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
            var lang = SUPPORTED_LANGS[i];
            var langInfo = LANG_LABELS[lang];
            var item = document.createElement('a');
            item.className = 'lang-selector__item' + (lang === currentLocale ? ' lang-selector__item--active' : '');
            item.href = buildUrl(lang);
            item.setAttribute('data-lang', lang);
            item.innerHTML = langInfo.flag + '&nbsp;&nbsp;' + langInfo.label;
            item.addEventListener('click', (function (l) {
                return function (e) {
                    e.preventDefault();
                    localStorage.setItem(LS_KEY, l);
                    window.location.href = buildUrl(l);
                };
            })(lang));
            dropdown.appendChild(item);
        }
        container.appendChild(dropdown);

        // Toggle
        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            container.classList.toggle('lang-selector--open');
        });
        document.addEventListener('click', function () {
            container.classList.remove('lang-selector--open');
        });

        // Inject into footer
        var footerContent = document.querySelector('.footer-content');
        if (footerContent) {
            footerContent.insertBefore(container, footerContent.firstChild);
        }
    }

    // ── Init ───────────────────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderSelector);
    } else {
        renderSelector();
    }
})();
