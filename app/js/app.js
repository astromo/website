'use strict';

var $body = $('body');
var $nav = $('nav:not(.alternate)');

var $nav_icon = $('nav i.icon-menu');

var isInvisibleNav = false;

function checkScrollTop(scrollTop, $nav) {
  if (scrollTop > 20) {
    if (!isInvisibleNav) $nav.removeClass('visible');
    isInvisibleNav = true;
  } else {
    if (isInvisibleNav) $nav.addClass('visible');
    isInvisibleNav = false;
  }
}

$(function() {
  var scrollTop = $body.scrollTop();

  checkScrollTop(scrollTop, $nav);

  $(window).on('scroll', function() {
    scrollTop = $body.scrollTop();

    checkScrollTop(scrollTop, $nav);
  });

  $nav_icon.on('click', function() {
    $body.toggleClass('nav-open');
  });

});
