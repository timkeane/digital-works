import $ from 'jquery';
import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';

const state = import.meta.env.VITE_APP_PATH;
const defaultLocale = 'en';

function getLocale() {
  const search = document.location.search;
  const params = {};
  if (search) {
    const pairs = search.substring(1).split("&");
    pairs.forEach(pair => {
      const nameValue = pair.split('=');
      params[nameValue[0]] = nameValue[1];
    })
  }
  let locale = params.locale;
  if (locale !== undefined) {
    return locale.split('-')[0];
  }
  locale = navigator.language.split('-')[0];
  if (locale === defaultLocale) {
    return locale;
  }
  document.location = `./?locale=${locale}`;
}

function addTranslation(locale) {
  return new Promise((reolve, reject) => {
    if (locale !== defaultLocale) {
      import(`./${state}/${locale}.js`).then(translation => {
        if (translation !== undefined) {
          reolve({locale, translation});
        }
      }).catch(error => {
        console.warn(`No translations for locale="${locale}"`);
        reolve({locale: defaultLocale});
      });
    } else {
      reolve({locale: defaultLocale})
    }
  })
}

function getDirection(lng) {
  return i18next.dir(lng);
}

export function getCurrentLanguage() {
  return i18next.language || defaultLocale;
}

export default function init() {
  const locale = getLocale();
  return new Promise((resolve, reject) => {
    import(`./${state}/en.js`).then(en => {
      const resources = {en};
      addTranslation(locale, resources).then(resource => {
        const lng = resource.locale;
        if (lng !== defaultLocale) {
          resources[lng] = resource.translation;
          $('#map-container').attr('dir', 'ltr');
          $('html').attr('lang', lng).attr('dir', getDirection(lng));
        }
        i18next.init({
          defaultLocale,
          fallbackLng: defaultLocale,
          defaultNS: 'translation',
          resources,
          lng
        }, (err, t) => {
          jqueryI18next.init(i18next, $, {useOptionsAttr: true});
          $('[data-i18n]').localize();
          resolve(resources);
        });
      });
    }).catch(error => {
      console.error({error, message: `Failed to load default translations for ${state}`});
      reject();
    });
  }).catch(error => console.error({error, message: 'Failed to initialize i18n'}));
}
