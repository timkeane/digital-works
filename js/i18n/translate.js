import $ from 'jquery';
import {store} from '../util';

export default function spin() {
  const html = $(`<div class="dropdown">
  <button id="translate" class="btn btn-primary dropdown-toggle focus-ring" type="button" data-i18n="translate" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
  <div class="dropdown-menu" aria-labelledby="translate">
  </div>
</div>`);

const languages = JSON.parse(import.meta.env.VITE_LANGUAGES);

languages.forEach(lang => {
  html.find('.dropdown-menu').append(`<a data-i18n="translate.${lang}" class="dropdown-item" href="./?locale=${lang}" rel="noopener"></a>`)
});
$('.banner').append(html.localize());

store('translate', html);

let i = 0;
let j = 0;
const button = $('.banner .dropdown .btn-primary');
const interval = setInterval(() => {
    i = i < languages.length - 1 ? i + 1 : 0;
    j = j + 1;
    if (j === languages.length * 10) {
      button.attr('data-i18n', 'translate').localize();
      clearInterval(interval);
    } else {
      button.attr('data-i18n', `translate.${languages[i]}`).localize();
    }
  }, 1000);
}