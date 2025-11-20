import $ from 'jquery';

function tabContentHeight(event) {
  const isMapTab = event?.target.id === 'map-tab' || $('#map-tab').hasClass('active');
  const windowHeight = $(window).outerHeight(true);
  const bannerHeight = $('#banner').outerHeight(true);
  const navHeight = $('#nav').outerHeight(true);

  $('#tab-content, #tab-col')[isMapTab ? 'addClass' : 'removeClass']('map-active');
  $('#tab-content').css('height', `${windowHeight - bannerHeight - navHeight}px`);
  $('#map-container').css('height', `${windowHeight - bannerHeight - navHeight}px`);
}

export function createResizeHandler() {
  $(window).on('resize', tabContentHeight);
  $('#nav button').on('click', tabContentHeight);
  setTimeout(tabContentHeight, 500);
}
