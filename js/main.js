// Configuration
const DEFAULT_LANG = 'fr';
const STORAGE_LANG = 'lang';
const STORAGE_THEME = 'theme';
let currentDict = {};

// Traduction : remplace le texte de chaque element [data-i18n] (html5)
function applyTranslations(dict) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = getValueFromKey(dict, key);
    if (value) {
      el.textContent = value;
    }
  });
}

// leer une valeur imbriquee dans un objet a partir d'une cle du type "hero.nombre"
function getValueFromKey(dict, key) {
  const parts = key.split('.');
  let value = dict;
  for (let i = 0; i < parts.length; i++) {
    value = value ? value[parts[i]] : undefined;
  }
  return value;
}

// Charge le fichier de langue 
function loadLanguage(lang) {
  fetch('langs/' + lang + '.json')
    .then((response) => response.json())
    .then((dict) => {
      currentDict = dict;
      applyTranslations(dict);
      document.documentElement.lang = lang;
      document.getElementById('lang-switch').value = lang;
      localStorage.setItem(STORAGE_LANG, lang);
    });
}

// Theme : bascule entre dark (par defaut) et light
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  const button = document.getElementById('theme-toggle');
  const key = theme === 'light' ? 'theme.light' : 'theme.dark';
  button.setAttribute('data-i18n', key);

  const value = getValueFromKey(currentDict, key);
  if (value) {
    button.textContent = value;
  }

  localStorage.setItem(STORAGE_THEME, theme);
}

// Scroll reveal ! affiche chaque section au moment ou elle entre dans l'ecran
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((el) => observer.observe(el));
}

// Menu mobile : ouvre et ferme le nav au clic sur le bouton hamburger
function initMobileMenu() {
  const button = document.getElementById('menu-toggle');
  const nav = document.querySelector('.site-header nav');
  button.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem(STORAGE_LANG) || DEFAULT_LANG;
  const savedTheme = localStorage.getItem(STORAGE_THEME) || 'dark';

  loadLanguage(savedLang);
  applyTheme(savedTheme);
  initScrollReveal();
  initMobileMenu();

  document.getElementById('lang-switch').addEventListener('change', (event) => {
    loadLanguage(event.target.value);
  });

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    applyTheme(isLight ? 'dark' : 'light');
  });
});
