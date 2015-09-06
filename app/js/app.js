'use strict'

var select = document.querySelector.bind(document)

var body = select('body')
var nav = select('nav:not(.alternate)')
var navIcon = select('nav i.icon-menu')

var isInvisibleNav = false

function checkScrollTop (scrollTop, nav) {
  if (scrollTop > 20) {
    if (!isInvisibleNav) nav.classList.remove('visible')
    isInvisibleNav = true
  } else {
    if (isInvisibleNav) nav.classList.add('visible')
    isInvisibleNav = false
  }
}

ready(function () {

  var scrollTop = body.scrollTop

  checkScrollTop(scrollTop, nav)

  window.addEventListener('scroll', function () {
    scrollTop = body.scrollTop

    checkScrollTop(scrollTop, nav)
  })

  navIcon.addEventListener('click', function () {
    body.classList.toggle('nav-open')
  })

})

function ready (fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}
