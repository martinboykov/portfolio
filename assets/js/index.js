import './jqueryLoader';
/* jQuery plugins */
import 'jquery-inview';
import 'jscroll';
import 'jquery-lazy';

import { gsap } from 'gsap';
import './splittext';

import 'bootstrap';
import Shuffle from 'shufflejs';
import WOW from 'wow.js/dist/wow.js';

new WOW({ mobile: false }).init();


console.log('%c 🦄 Hello curious voyager! ',
  'background: black; color: #68c3a3');


let isMobile = false; // initiate as false
const regex = new RegExp(
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);

// device detection
if (regex.test(navigator.userAgent)) {
  isMobile = true;
}
$(window).on('load', function() {
  $('#preloader').fadeOut(1000);
  if (isMobile) $("body").removeClass("fixed");
});

/* ---------------------------------------------- /*
 * Preloader
/* ---------------------------------------------- */

// $('.lazy').lazy();
$('.lazy').lazy({
  combined: true,
  delay: 1000,
});




/* ---------------------------------------------- /*
 * Home Animation
/* ---------------------------------------------- */
if (!isMobile) {
  const minDist = 1;
  const maxDist = 200;
  const duration = 3;
  const opVal = 0;
  const getText = (selector) => document.querySelector(selector);
  const getLetters = (selector) => gsapCustom.Plugins.SplitText(getText(selector), { words: 1, chars: 1, spacing: 10 }).chars;
  const getSign = () => gsap.utils.random(1, 2, 1) == 1 ? 1 : -1; // gsap.utils.random(min,max,increment)
  const getDistance = (min, max) => gsap.utils.random(min, max, 1);
  const getRotAngle = () => gsap.utils.random(1, 90, 1);
  const getScaleFactor = () => gsap.utils.random(1, 6, 1);
  // $("body").addClass("fixed");
  const getAnimation = (letter, min = minDist, max = maxDist, sF = getScaleFactor()) => {
    return gsap.from($(letter), duration, {
      opacity: opVal,
      x: `${getSign()}${getDistance(min, max)}`,
      y: `${getSign()}${getDistance(min, max)}`,
      rotation: `${getSign() * getSign()}${getRotAngle()}`,
      scale: sF,
      onComplete: () => { $("body").removeClass("fixed"); }
    });
  };
  $('.nav.navbar-nav li a').each(function() {
    getLetters(`.` + $(this).attr('class'))
      .forEach((letter) => getAnimation(letter, minDist, maxDist, 1));
  });
  getLetters('.text.name')
    .forEach((letter) => getAnimation(letter));
  getLetters('.text.title')
    .forEach((letter) => getAnimation(letter));
  getAnimation('.social-icons .list-inline li');
  getAnimation('.mouse-icon');
}

// -------------------------------------------------------------
// Full Screen Slider
// -------------------------------------------------------------

$('.tt-fullHeight').height($(window).height());

$(window).resize(function() {
  $('.tt-fullHeight').height($(window).height());

  // modal
  // $('.modal-dialog').css('margin-top', calculateMarginTop());
  // adjustModalPosition();
});


// -------------------------------------------------------------
// Menu
// -------------------------------------------------------------
const $menu = $('.navbar-custom');
const $navbar = $('.navbar-collapse');
$(document).click(function(e) {
  if (!$menu.is(e.target)
    // close menu only if clicked outside of it
    && $menu.has(event.target).length === 0
  ) {
    $navbar.slideUp();
  }
});
$menu.click(function() {
  $navbar.slideToggle();
})

// -------------------------------------------------------------
// Animated scrolling
// -------------------------------------------------------------
// checks if ie or edge
function ieVersion(uaString) {
  uaString = uaString || navigator.userAgent;
  const match = /\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/.exec(uaString);
  if (match) return parseInt(match[2], 10);
  return null;
}
if (!ieVersion()) {
  $('body').scrollspy({ target: '.navbar' });

  $('a[href*="#"]').bind('click', function(e) {
    const anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $(anchor.attr('href')).offset().top,
    }, 1000);
    // e.preventDefault();
  });
}

// -------------------------------------------------------------
// Shuffle
// -------------------------------------------------------------
// const Shuffle = window.Shuffle;
Shuffle.options.isCentered = true;
// Shuffle.options.useTransforms = true;
const element = document.querySelector('.my-shuffle-container');
const sizer = element.querySelector('.my-sizer-element');
const shuffleInstance = new Shuffle(element, {
  itemSelector: '.picture-item',
  sizer: sizer, // could also be a selector: '.my-sizer-element'
});

/* reshuffle when user clicks a filter item */
$('.shuffle-button').bind('click', function(e) {
  const anchor = $(this);
  anchor.addClass('active');
  $('.shuffle-button').not(this).removeClass('active');
  const query = anchor.attr('data-group');
  if (query === 'all') shuffleInstance.filter();
  shuffleInstance.filter(query);
  $(`.shuffle-radio[value=${query}]`).prop('checked', true);
});

$('.shuffle-radio').bind('change', function(e) {
  $('.shuffle-radio').not(this).prop('checked', false);
  const anchor = $(this);
  const query = anchor.attr('value');
  if ($(this).is(':checked')) {
    if (query === 'all') shuffleInstance.filter();
    shuffleInstance.filter(query);
  } else {
    shuffleInstance.filter();
  }
  $(`.shuffle-button`).removeClass('active');
  $(`.shuffle-button[data-group=${query}]`).addClass('active');
});

if (isMobile) {
  $('.picture-item .img-overlay').css('opacity', '1');
  $('.picture-item .btn-success')
    .css('background-color', 'rgba(41, 41, 41, 0.289)');
}

// -------------------------------------------------------------
// Back To Top
// -------------------------------------------------------------

// button that triggers going to top of the page
$(window).scroll(function() {
  if ($(this).scrollTop() > 100) {
    $('.scroll-up').fadeIn();
  } else {
    $('.scroll-up').fadeOut();
  }
});

