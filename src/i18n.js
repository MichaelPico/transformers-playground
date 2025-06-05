import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.mainItems': 'Main items',
      'nav.dashboard': 'Dashboard',
      'nav.ner': 'Name Entity Recognition',
      'nav.similarity': 'Sentence Similarity',
      'nav.classification': 'Text Classification',
      'nav.summarization': 'Summarization',
      
      // Dashboard
      'dashboard.welcome': 'Welcome to Transformers Playground!',
      'dashboard.description': 'Explore the power of transformer models with our interactive tools.',
      
      // Common
      'app.title': 'Transformers Playground',
    }
  },
  es: {
    translation: {
      // Navigation
      'nav.mainItems': 'Elementos principales',
      'nav.dashboard': 'Panel de control',
      'nav.ner': 'Reconocimiento de entidades',
      'nav.similarity': 'Similitud de oraciones',
      'nav.classification': 'Clasificación de texto',
      'nav.summarization': 'Resumen de texto',
      
      // Dashboard
      'dashboard.welcome': '¡Bienvenido a Transformers Playground!',
      'dashboard.description': 'Explora el poder de los modelos transformadores con nuestras herramientas interactivas.',
      
      // Common
      'app.title': 'Transformers Playground',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // default language
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n; 