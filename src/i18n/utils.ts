export const languages = {
    en: 'En',
    hr: 'Hr'
  };
  
  export type Language = keyof typeof languages;
  export const defaultLang = 'en';
  
  export const translations = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.blog': 'Blog',
      'nav.resume': 'Resume(CV)'
    },
    hr: {
      'nav.home': 'Početna',
      'nav.about': 'O meni',
      'nav.blog': 'Blog',
      'nav.resume': 'Životopis'
    }
  } as const;
  
  export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in languages) return lang as Language;
    return defaultLang;
  }
  
  export function useTranslations(lang: Language) {
    return function t(key: keyof typeof translations[typeof defaultLang]) {
      return translations[lang][key] || translations[defaultLang][key];
    }
  }
  