import $ from 'jquery';

const html = `<a class="help" rel="noopener" target="_blank"
  href="${import.meta.env.VITE_HELP_URL}"
  data-i18n="[title]dialog.guide.title;[aria-label]dialog.guide.title;"
  type="button"><h2 class="screen-reader-only" data-i18n="dialog.guide.title"
  ></h2><span aria-hidden="true">?</span></a>`;

export default function create(insertAfter) {
  const help = $(html);
  help.insertAfter(insertAfter);
}
