import {getCurrentLanguage} from '../i18n/i18n';
import {getAppPath} from '../util';

export default function(appendTo) {
  import(`./${getAppPath()}/${getCurrentLanguage()}.js`).then(guide => {
    appendTo.empty().append(guide.default);
  });
}
