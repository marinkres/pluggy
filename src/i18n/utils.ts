export const languages = {
    en: 'EN',
    jp: 'JP'
  };
  
  export type Language = keyof typeof languages;
  export const defaultLang = 'en';
  
  export const translations = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.blog': 'Blog',
      'nav.resume': 'Resume(CV)',
      'social.find': 'Find me on'
    },
    jp: {
      'nav.home': 'ホーム',
      'nav.about': '約',
      'nav.blog': 'ブログ',
      'nav.resume': '履歴書',
      'social.find': '私を見つける'
    },
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
  