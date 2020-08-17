/* eslint no-invalid-this: 0 */
/* eslint no-unused-vars: 0 */
import './jquery';
import './snap-scroll';
import { gsap } from 'gsap';
import './splittext';
import 'bootstrap';
import Shuffle from 'shufflejs';
import WOW from 'wow.js/dist/wow.js';
/* jQuery plugins */
import 'easy-pie-chart/dist/jquery.easypiechart';
import 'jquery-inview';
import 'jscroll';
import 'jquery-lazy';
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

})

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
  $("body").addClass("fixed");
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

if (!isMobile) {
  $(".section").SnapScroll({
    animateDuration: 1000,
    wheelInterval: 1500,
  });
}

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

// const Wow = window.WOW;


// -------------------------------------------------------------
// Countup
// -------------------------------------------------------------
// $('.count-wrap').bind('inview',
//   function(event, visible, visiblePartX, visiblePartY) {
//     if (visible) {
//       $(this).find('.timer').each(function() {
//         const $this = $(this);
//         $({ Counter: 0 }).animate({ Counter: $this.text() }, {
//           duration: 2000,
//           easing: 'swing',
//           step: function() {
//             $this.text(Math.ceil(this.Counter));
//           },
//         });
//       });
//       $(this).unbind('inview');
//     }
//   });

// -------------------------------------------------------------
// Progress Bar
// -------------------------------------------------------------


// $('.skill-progress').bind('inview',
//   function(event, visible, visiblePartX, visiblePartY) {
//     if (visible) {
//       $.each($('div.progress-bar'), function() {
//         $(this).css('width', $(this).attr('aria-valuenow') + '%');
//       });
//       $(this).unbind('inview');
//     }
//   });


// -------------------------------------------------------------
// More skill
// -------------------------------------------------------------
// $('.main-skills').bind('inview',
//   function(event, visible, visiblePartX, visiblePartY) {
//     if (visible) {
//       $('.chart').easyPieChart({
//         easing: 'easeOut',
//         delay: 3000,
//         barColor: '#ff8080',
//         trackColor: '#e1e1e1',
//         scaleColor: false,
//         lineWidth: 8,
//         size: 140,
//         animate: 2000,
//         onStep: function(from, to, percent) {
//           this.el.children[0].innerHTML = Math.round(percent);
//         },

//       });
//       $(this).unbind('inview');
//     }
//   });

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
// Modal
// -------------------------------------------------------------
// detect browser scroll bar width
function getScrollBarWidth() {
  const $outer = $('<div>').css({
    visibility: 'hidden', width: 100, overflow: 'scroll',
  }).appendTo('body');
  const widthWithScroll =
    $('<div>').css({ width: '100%' }).appendTo($outer).outerWidth();
  $outer.remove();
  return 100 - widthWithScroll;
}

$(document)
  .on('hidden.bs.modal', '.modal', function(evt) {
    // use margin-right 0 for IE8
    $(document.body).css('margin-right', '');
  })
  .on('show.bs.modal', '.modal', function() {
    // ...
  })
  .on('shown.bs.modal', '.modal.in', function() {
    $('.modal-dialog').css('left', Math.ceil(getScrollBarWidth() / 2));
    $('.modal.in').css({
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'flex-start',
      'margin-top': '70px',
    });
  });

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


// let isMapLoaded = false;

// if (isMobile) $('.location-map').css('display', 'none');
// setTimeout(() => {
//   if (!isMapLoaded && !isMobile) {
//     loadAPI();
//   } else {
//     // $('.location-map').css('display', 'none');
//   }
// }, 5000);

$('.location-map').bind('inview',
  function(event, visible, visiblePartX, visiblePartY) {
    if (visible && !isMobile) {
      // if (!isMapLoaded) loadAPI();
      loadAPI();
      $(this).unbind('inview');
    } else {
      $(this).css('display', 'none');
    }
  });
function loadAPI() {
  // isMapLoaded = true;
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA3bPGZhH-iD28-Bpht14BiGhun_Pc3iSU',
    type: 'GET',
    // crossDomain: true,
    dataType: 'jsonp',

    success: function(result, status, xhr) {
      const Google = window.google;
      const myLatLng = { lat: 42.669290, lng: 23.279843 };
      const map = new Google.maps.Map(
        document.body.querySelector('.location-map'), {
        center: myLatLng,
        zoom: 11,
      });
      const marker = new Google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!',
      });
    },
    error(xhr, status, error) {
      // ...
    },
  });
}

  // -------------------------------------------------------------
  // Contact Form
  // -------------------------------------------------------------

  // $('#contactForm').on('submit', function(e) {
  //   e.preventDefault();
  //   const $action = $(this).prop('action');
  //   const $data = $(this).serialize();
  //   const $this = $(this);
  //   const name = $this.find('#name').val();
  //   const email = $this.find('#email').val();
  //   const subject = $this.find('#subject').val();
  //   const message = $this.find('#message').val();
  //   console.log({ query: $data });
  //   console.log({ name, email, subject, message });


  //   $this.prevAll('.alert').remove();

  // $.post($action, $data, function(data) {

  //   if (data.response == 'error') {

  //     $this.before('<div class='alert alert - danger'>' + data.message + '</div>');
  //   }

  //   if (data.response == 'success') {

  //     $this.before('<div class='alert alert - success'>' + data.message + '</div>');
  //     $this.find('input, textarea').val('');
  //   }

  // }, 'json');
  // });
