import $ from 'jquery';

export default function() {
  const mailto = $('#request a');
  mailto.on('mousedown', () => {
    const to = $('#to-email').val();
    const cc = $('#cc-email').val().split(' ').join(';');
    const subject = encodeURIComponent($('#request h2').html());
    const type = `${$('label[for="request-type"]').html()} ${$('#request-type').val()}`;
    const topic = `${$('label[for="request-topic"]').html()} ${$('#request-topic').val()}`;
    const note = `${$('label[for="request-note"]').html()}\n${$('#request-note').val()}`;
    const body = encodeURIComponent(`\n${type}\n${topic}\n\n${note}\n\n`);
    mailto.attr('href', `mailto:${to}?subject=${(subject)}&cc=${cc}&body=${body}`);
  });
}
