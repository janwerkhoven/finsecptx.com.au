$(document).ready(function() {

  // Open mobile navigation
  var showingMobileNav = false;
  $('header button').on('click', function() {
    if (!$('header .menu').hasClass('velocity-animating')) {
      if (showingMobileNav) {
        $('body').removeClass('no-scroll');
        $('main').removeClass('blur');
        $('header .menu ul').velocity({
          opacity: 0
        }, 800, 'easeOutExpo');
        $('header .menu').velocity({
          backgroundColor: "#0f1d3c",
          backgroundColorAlpha: 0
        }, 800, 'easeOutExpo', function() {
          $(this).hide();
        });
        showingMobileNav = false;
      } else {
        $('body').addClass('no-scroll');
        $('main').addClass('blur');
        $('header .menu ul').velocity({
          opacity: [1, 0]
        }, 800, 'easeOutExpo');
        $('header .menu').show().velocity({
          backgroundColor: "#0f1d3c",
          backgroundColorAlpha: [0.8, 0]
        }, 800, 'easeOutExpo');
        $('html, body').animate({
          scrollTop: 0
        }, 200);
        showingMobileNav = true;
      }
    }
  });

  // Close mobile nav on click of mobile nav background
  $('header .menu').on('click', function() {
    $('header .menu').removeClass('fixed');
    $('body').removeClass('no-scroll');
    $('main').removeClass('blur');
    showingMobileNav = false;
  });

  // Prevent mobile nav from closing when links are clicked
  $('header').find('a, button').on('click', function(e) {
    e.stopPropagation();
  });

  // Animations of About page diagram
  $('#about #process').find('h3, .img, .desc').on('click mouseenter', function() {
    $(this).parent('li').addClass('active').siblings('li').removeClass('active');
  });

  // Make any hashtag link scroll with animation to element with matching ID
  // Example: <a href="#features"> will scroll to element with ID #features
  // Commonly found in the #hero of each page
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

});
