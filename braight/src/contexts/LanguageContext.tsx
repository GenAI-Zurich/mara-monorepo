import { createContext, useContext, useState, useEffect, useCallback } from "react";
import translations, { type Locale, type TranslationKey } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Try localStorage first for immediate display
    return (localStorage.getItem('braight_lang') as Locale) || 'en';
  });

  // Load language from profile on login
  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('language').eq('id', user.id).single().then(({ data }) => {
      if (data?.language && ['en', 'de', 'fr', 'it'].includes(data.language as string)) {
        setLocaleState(data.language as Locale);
        localStorage.setItem('braight_lang', data.language as string);
      }
    });
  }, [user]);

  const setLocale = useCallback(async (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('braight_lang', newLocale);
    if (user) {
      await supabase.from('profiles').update({ language: newLocale } as any).eq('id', user.id);
    }
  }, [user]);

  const t = useCallback((key: TranslationKey, vars?: Record<string, string | number>): string => {
    const entry = translations[key];
    if (!entry) return key;
    let text: string = (entry as any)[locale] || (entry as any)['en'] || key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
