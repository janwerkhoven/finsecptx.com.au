$(document).ready(function() {

  $('header a.logo').on('click', function(e) {
    e.preventDefault();

    // POST https://www.webmerge.me/merge/72409/2ygbxs?test=1
    // first_name=John&last_name=Smith&phone=312-555-3029
    // {$Name}
    // {$Email}
    // {$Phone_Number}

    console.log('Sending to Webmerge');

    var keyValues = 'name=Janneman&email=jw@nabu.io&phone_number=0424787666';

    // $.ajax({
    //   type: "POST",
    //   url: url,
    //   data: data,
    //   success: success,
    //   dataType: dataType
    // });

    $.ajax({
      type: 'POST',
      url: 'https://www.webmerge.me/merge/72409/2ygbxs?test=1',
      data: keyValues
        // url: '//finsecptx.us13.list-manage.com/subscribe/post-json?u=500670fda51c3a1aa312eecfa&id=45b7594928&c=?',
        // url: '//colettewerden.us8.list-manage.com/subscribe/post-json?u=63fca17be61d516e518647941&id=5d51cd78d5&c=?',
        // url: '//colettewerden.us8.list-manage.com/subscribe/post-json?u=63fca17be61d516e518647941&id=f0f8a6944e&c=?', // testing list
        // data: data,
        // data: 'name=Janneman&email=jw@nabu.io&phone_number=0424787666',
        // cache: false,
        // dataType: 'json',
        // contentType: "application/json; charset=utf-8"
    }).done(function(data) {
      // $btn.html('Success');
      // $('#subscription .success').show();
      console.log('DONE', data);
    }).fail(function(error) {
      // $btn.html('Whoops');
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

  PAGE = $('body').attr('id');

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

    // TODO REPLACE WITH FORMSPREE
    // Cannot submit to Mailchimp without mailconfirmation

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

  function emailStageOneWithFormSpree() {

    // Submits the contact form to Formspree
    // More info: https://formspree.io/
    var data = {
      message: 'This is an incomplete form for reference only.',
      _subject: 'FinsecPTX.com - Preliminary form result - for reference only',
      _format: 'plain'
    };
    var keys = ['title', 'name', 'email', 'phone', 'state', 'age'];
    $.each(keys, function(i, key) {
      data[key] = sessionStorage.getItem(key) || '-';
    });
    console.log('sending', data);
    $.ajax({
      url: "https://formspree.io/info@finsecptx.com",
      method: "POST",
      data: data,
      dataType: "json"
    }).done(function() {
      console.log('DONE');
    }).fail(function(jqXHR, textStatus, errorThrown) {
      console.log('ERROR', jqXHR, textStatus, errorThrown);
    });
  }

  function subscribeToMailChimp() {
    // var $btn = $(this);
    // var speed = 300;
    // var easing = 'easeInOut';
    // var data = $form.serialize();
    var data = $('#title-name, #email-phone, #state-age').find('input, select').serialize();
    console.log('submitting', data);
    // $form.find('input, button').prop('disabled', true);
    // $btn.html('Sending...');
    $.ajax({
      type: 'get',
      url: '//finsecptx.us13.list-manage.com/subscribe/post-json?u=500670fda51c3a1aa312eecfa&id=0d0bbdfa29&c=?',
      // url: '//colettewerden.us8.list-manage.com/subscribe/post-json?u=63fca17be61d516e518647941&id=5d51cd78d5&c=?',
      // url: '//colettewerden.us8.list-manage.com/subscribe/post-json?u=63fca17be61d516e518647941&id=f0f8a6944e&c=?', // testing list
      data: data,
      cache: false,
      dataType: 'json',
      contentType: "application/json; charset=utf-8"
    }).done(function(data) {
      // $btn.html('Success');
      // $('#subscription .success').show();
      console.log('DONE', data);
      $('#form #subscribed p.email').text(answers.email);
      goToStep('#subscribed');
    }).fail(function(error) {
      // $btn.html('Whoops');
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
  }

  function goTo(id) {
    if (!location.hash && id === 'prev') {
      window.location = '/';
    }
    var $active = $('#form section' + location.hash);
    id = id === 'next' ? $active.next().attr('id') : id;
    id = id === 'prev' ? $active.prev().attr('id') : id;
    console.log('goTo', id);
    history.pushState(null, null, '#' + id);
    animateToHash();
  }

  function animateToHash() {
    if ($('#form ' + location.hash).length) {
      $('#form ' + location.hash).show().siblings('section').hide();
    } else {
      history.pushState('', document.title, window.location.pathname);
    };
  }

  jQuery.fn.extend({
    isValid: function() {
      id = this.attr('id');
      if (rules[id]) {
        return rules[id]();
      } else {
        return true;
      }
    }
  });

  if (PAGE === 'form') {

    animateToHash();

    var answers = {};

    $('section button.back').on('click', function() {
      var target = $(this).attr('for');
      if (target) {
        goTo(target);
      } else {
        goTo('prev');
      }
    });

    $('section button.next').on('click', function() {
      var thisSection = $(this).closest('section');
      if (thisSection.isValid()) {
        goTo('next');
      }
    });

    var rules = {
      'state-age': function() {
        var age = parseInt(answers.age);
        if (Number.isInteger(age)) {
          if (age < 45) {
            goTo('below-45');
          } else if (age < 55) {
            goTo('between-45-and-55');
          } else {
            return true;
          }
        } else {
          $('#state-age .buttons p').show(300);
        }
      },
      'below-45': function() {
        $('#email-check input').val(sessionStorage.getItem('email'));
        goTo('email-check');
      },
      'between-45-and-55': function() {
        $('#email-check input').val(sessionStorage.getItem('email'));
        goTo('email-check');
      },
      'email-check': function() {
        $('#subscribed p.email em').text(sessionStorage.getItem('email'));
        subscribeToMailChimp();
        goTo('subscribed');
      },
      'over-55': function() {
        goTo('start-enquiry');
      },
      'start-enquiry': function() {
        keys = ['title', 'name', 'email', 'phone'];
        $.each(keys, function(i, v) {
          $('#name-email-again ' + 'input[name="' + v.toUpperCase() + '"]').val(sessionStorage.getItem(v));
        });
        goToStep('name-email-again');
      }
    };

    // Observe all text inputs and populate the answers object on the key matching the name attribute of the text input
    $('input[type="text"], input[type="email"], input[type="range"], select').on('keyup blur change', function() {
      var key = $(this).attr('name').toLowerCase();
      var value = $(this).val();
      answers[key] = value;
      sessionStorage.setItem(key, value);
      console.log(answers);
    });

    // Animate a line under text input fields on focus, blur and change. Maintain line if has value.
    $('#form').find('input[type="text"], input[type="email"]').on('focus', function() {
      $(this).parent().addClass('focus');
    }).on('blur', function() {
      $(this).parent().removeClass('focus');
    }).on('change', function() {
      if ($(this).val()) {
        $(this).parent().addClass('has-value');
      } else {
        $(this).parent().removeClass('has-value');
      }
    });

    // Add class to help style
    $('input[placeholder]').closest('.field').addClass('has-placeholder');

    // Add class selected if user selected a value from <select>
    $('#form select').on('change', function() {
      if ($(this).val()) {
        $(this).addClass('selected');
      } else {
        $(this).removeClass('selected');
      }
    });

    // Make time ranges update the adjecent input box
    $('#form input[type="range"]').on('change mousemove', function(e) {
      if (e.type === 'change' || e.type === 'mousemove' && $(this).hasClass('dragging')) {
        $(this).siblings('input[type="text"]').val($(this).val());
      }
    }).on('mousedown', function(e) {
      $(this).addClass('dragging');
    }).on('mouseup', function(e) {
      $(this).removeClass('dragging');
    });

    // On click of back button use history API to go back
    $('main nav a.back').on('click', function(e) {
      e.preventDefault();
      // window.history.back();
      goTo('prev');
    });

  }

});
