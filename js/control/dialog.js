import $ from 'jquery';

const dialogHtml = `<div id="dialog" class="modal fade" data-bs-keyboard="false" data-bs-backdrop="static" tabindex="-1" aria-hidden="true">
  <div id="modal" class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
      <h2></h2>
      <button class="popup-closer" data-i18n="[aria-label]btn.close.name;[title]btn.close.name" data-bs-dismiss="modal"></button>
    </div>
    <div class="modal-body"></div>
      <div class="modal-footer">
        <div class="end">
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
const ok = $('#dialog button.ok').hide();
const message = $('#dialog .modal-body');
const modal = $('#modal').get(0);
const dismiss = $('#dialog button.popup-closer');

function close(callback, yesNo) {
  dialog.hide();
  $('body').removeClass('intro');
  modal.className = 'modal-dialog';
  message.removeAttr('data-i18n').empty();
  header.hide().find('h2').removeAttr('data-i18n').empty();
  footer.hide();
  ok.hide();
  if (typeof callback === 'function') callback(yesNo);
}

dismiss.off().on('click', close);
ok.on('click', close);

export function showIntro() {
  const body = $('body');
  $('body').addClass('intro');
  modal.className = 'intro';
  message.attr('data-i18n', '[html]dialog.intro').localize();
  header.show().find('h2').attr('data-i18n', 'dialog.intro.title').localize();
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
