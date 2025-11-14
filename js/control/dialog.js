import $ from 'jquery';
import setGuide from '../guide/guide';

const dialogHtml = `<div id="dialog" class="modal fade" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1" aria-hidden="true">
  <div id="modal" class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
      <h2></h2>
      <button type="button" class="btn-close" data-bs-dismiss="modal" data-i18n="[aria-label]btn.close.no"></button>
    </div>
    <div class="modal-body"></div>
      <div class="modal-footer">
        <div class="start">
          <input id="always" type="checkbox" class="form-check-input always">
          <label for="always" class="always" data-i18n="dialog.always"></label>
        </div>
        <div class="end">
          <button type="button" class="btn btn-secondary no" data-bs-dismiss="modal" data-i18n="btn.no.name"></button>
          <button type="button" class="btn btn-primary yes" data-i18n="btn.yes.name"></button>
          <button type="button" class="btn btn-primary ok" data-i18n="btn.ok.name"></button>
          </div>
      </div>
    </div>
  </div>
</div>`;

$('body').append(dialogHtml);

const dialog = new bootstrap.Modal('#dialog');

const header = $('#dialog .modal-header').hide();
const footer = $('#dialog .modal-footer').hide();
const yes = $('#dialog button.yes').hide();
const no = $('#dialog button.no').hide();
const ok = $('#dialog button.ok').hide();
// const check = $('#dialog input.always').on('change', () => saveAlwaysLoad(check.is(':checked')));
const always = $('#dialog .always').hide();
const message = $('#dialog .modal-body');
const modal = $('#modal').get(0);
const dismiss = $('#dialog button.btn-close');

function close(callback, yesNo) {
  dialog.hide();
  $('body').removeClass('intro');
  modal.className = 'modal-dialog';
  message.removeAttr('data-i18n').empty();
  header.hide().find('h2').removeAttr('data-i18n').empty();
  footer.hide();
  yes.hide().off();
  no.hide().off();
  ok.hide();
  always.hide();
  if (typeof callback === 'function') callback(yesNo);
}

dismiss.off().on('click', close);
ok.on('click', close);

export function showRestoreDialog(callback) {
  message.attr('data-i18n', 'dialog.restore').localize();
  footer.show();
  yes.show().one('click', () => close(callback, true));
  no.show().one('click', () => close(callback, false));
  always.show();
  dialog.show();
}

export function showDeleteDialog(callback) {
  message.attr('data-i18n', 'dialog.delete').localize();
  footer.show();
  yes.show().one('click', () => close(callback, true));
  no.show().one('click', () => close(callback, false));
  dialog.show();
}

export function showChallengeDateDialog() {
  const begin = new Date(import.meta.env.VITE_SUBMIT_DATE);
  message.append(`&nbsp;${begin.toLocaleString()}`)
    .attr('data-i18n', '[prepend]dialog.premature').localize();
  footer.show();
  ok.show();
  dialog.show();
}

export function showGuide() {
  modal.className = 'guide';
  setGuide(message);
  header.show().find('h2').attr('data-i18n', 'dialog.guide.title').localize();
  dialog.show();
}

export function showIntro() {
  const body = $('body');
  $('body').addClass('intro');
  modal.className = 'intro';
  message.attr('data-i18n', '[html]dialog.intro').localize();
  header.show().find('h2').attr('data-i18n', 'dialog.intro.title').localize();
  $('#show-guide').on('click', () => body.removeClass('intro')).on('click', showGuide);
  dialog.show();
}

export function showProviders(table, callback) {
  $(modal).addClass('provider');
  new MutationObserver(() => setTimeout(() => message.removeClass('loading'), 500))
    .observe(table.get(0), {attributes: true});
  message.addClass('loading').append(table);
  header.show().find('h2').attr('data-i18n', 'dialog.provider.title').localize();
  $('#dialog button.btn-close').one('click', callback);
  dialog.show();
}

export function showAlert(alert, callback) {
  modal.className = 'modal-dialog alert';
  message.html(alert);
  header.hide();
  footer.show();
  ok.show().one('click', () => close(callback, false));
  dialog.show();
}

export function showYesNo(alert, callback) {
  modal.className = 'modal-dialog alert';
  message.html(alert);
  header.hide();
  footer.show();
  yes.show().one('click', () => close(callback, true));
  no.show().one('click', () => close(callback, false));
  dialog.show();
}
