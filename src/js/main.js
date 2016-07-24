$(document).ready(function() {

  // Mobile navigation
  var showingMobileNav = false;
  $('header button').on('click', function() {
    if (showingMobileNav) {
      $('header .menu').removeClass('fixed');
      $('body').removeClass('no-scroll');
      $('main').removeClass('blur');
      showingMobileNav = false;
    } else {
      $('header .menu').addClass('fixed');
      $('body').addClass('no-scroll');
      $('main').addClass('blur');
      showingMobileNav = true;
      $('html, body').animate({
        scrollTop: 0
      }, 200);
    }
  });

  // Close mobile nav on click of background
  $('header .menu').on('click', function() {
    $('header .menu').removeClass('fixed');
    $('body').removeClass('no-scroll');
    $('main').removeClass('blur');
    showingMobileNav = false;
  });

  // Prevent mobile nav from closing on clicking links
  $('header').find('a, button').on('click', function(e) {
    e.stopPropagation();
  });

  // About page diagram interaction
  $('#about #process').find('h3, .img, .desc').on('click mouseenter', function() {
    $(this).parent('li').addClass('active').siblings('li').removeClass('active');
  });

  // Submit call back form on contact page
  $('#call-back button').on('click', function(e) {
    e.preventDefault();
    var $btn = $(this);
    var $form = $('#call-back form');
    var speed = 300;
    var easing = 'easeInOut';
    var data = $form.serialize();
    console.log('submitting', data);
    $form.find('input, button').prop('disabled', true);
    $btn.html('Sending...');
    $.ajax({
      type: 'get',
      url: '//finsecptx.us13.list-manage.com/subscribe/post-json?u=500670fda51c3a1aa312eecfa&id=45b7594928&c=?',
      // url: '//colettewerden.us8.list-manage.com/subscribe/post-json?u=63fca17be61d516e518647941&id=5d51cd78d5&c=?',
      // url: '//colettewerden.us8.list-manage.com/subscribe/post-json?u=63fca17be61d516e518647941&id=f0f8a6944e&c=?', // testing list
      data: data,
      cache: false,
      dataType: 'json',
      contentType: "application/json; charset=utf-8"
    }).done(function(data) {
      $btn.html('Success');
      // $('#subscription .success').show();
      console.log('DONE', data);
    }).fail(function(error) {
      $btn.html('Whoops');
      // $('#subscription .fail').show();
      console.log('ERROR', error);
    }).always(function() {
      // $('#subscription .form').delay(500).velocity({
      //   opacity: 0,
      //   scale: 0.9,
      // }, speed, easing);
      // $('#subscription .overlay').delay(500 + (speed * 0.8)).addClass('show').velocity({
      //   opacity: [1, 0],
      //   scale: [1, 1.1],
      // }, speed, easing);
    });
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

  // Warn outdated browsers to update
  outdatedBrowser({
    bgColor: '#f25648',
    color: '#ffffff',
    lowerThan: 'transform',
    languagePath: ''
  });

  // FORM LOGIC -----------------------------------------------------------------------

  var page = $('body').attr('id');

  function goToStep(id) {
    history.pushState(null, null, id);
    animateToHash();
    // $('#form ' + id).show().siblings('section').hide();
  }

  function animateToHash() {
    var id = location.hash || '#hello';
    $('#form ' + id).show().siblings('section').hide();
  }

  if (location.hash && $('#form ' + location.hash).length) {
    goToStep(location.hash)
  }

  $(window).on('popstate', function(e) {
    animateToHash();
  });

  if (page === 'form') {

    var step = 'hello';

    $('#hello button').on('click', function() {
      goToStep('#title-name');
    });

    $('#title-name button').on('click', function() {
      goToStep('#email-phone');
    });

    $('#email-phone button').on('click', function() {
      goToStep('#state-age');
    });

    $('#state-age button').on('click', function() {
      var age = 56;
      if (age > 55) {
        goToStep('#over-55');
      } else if (age > 45) {
        goToStep('#between-45-and-55');
      } else {
        goToStep('#below-45');
      }
    });

    $('main nav a.back').on('click', function() {
      window.history.back();
    });

    $('#form .field.text input').on('focus', function() {
      $(this).parent().addClass('focus');
    }).on('blur', function() {
      $(this).parent().removeClass('focus');
    });

    $('#form .field.select select').on('change', function() {
      if ($(this).val()) {
        $(this).addClass('selected');
      } else {
        $(this).removeClass('selected');
      };
    });

  }

});
