answers = {};

// function emailStageOneWithFormSpree() {
//
//   // Submits the contact form to Formspree
//   // More info: https://formspree.io/
//   var data = {
//     message: 'This is an incomplete form for reference only.',
//     _subject: 'finsecptx.com.au - Preliminary form result - for reference only',
//     _format: 'plain'
//   };
//   var keys = ['title', 'name', 'email', 'phone', 'state', 'age'];
//   $.each(keys, function(i, key) {
//     data[key] = sessionStorage.getItem(key) || '-';
//   });
//   console.log('sending', data);
//   $.ajax({
//     url: "https://formspree.io/info@finsecptx.com",
//     method: "POST",
//     data: data,
//     dataType: "json"
//   }).done(function() {
//     console.log('DONE');
//   }).fail(function(jqXHR, textStatus, errorThrown) {
//     console.log('ERROR', jqXHR, textStatus, errorThrown);
//   });
// }

function subscribeToMailChimp() {
  // var $btn = $(this);
  // var speed = 300;
  // var easing = 'easeInOut';
  // var data = $form.serialize();
  var data = $('#subscribe #start, #subscribe #phone-state-age').find('input, select').serialize();
  console.log('submitting', data);
  // $form.find('input, button').prop('disabled', true);
  // $btn.html('Sending...');
  $.ajax({
    type: 'get',
    url: '//finsecptx.us13.list-manage.com/subscribe/post-json?u=500670fda51c3a1aa312eecfa&id=0d0bbdfa29&c=?',
    data: data,
    cache: false,
    dataType: 'json',
    contentType: "application/json; charset=utf-8"
  }).done(function(data) {
    // $btn.html('Success');
    // $('#subscription .success').show();
    console.log('DONE', data);
    $('.form #subscribed p.email em').text(answers.email);
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

function submitFormToWebMerge() {

  // POST https://www.webmerge.me/merge/72409/2ygbxs?test=1
  // first_name=John&last_name=Smith&phone=312-555-3029
  // {$Name}
  // {$Email}
  // {$Phone_Number}

  var $btn = $('#review button.submit');
  $btn.html('Sending...').prop('disabled', true);

  // console.log('Submitting form to Webmerge ...', date);
  // $.ajax({
  //   url: "https://formspree.io/info@finsecptx.com",
  //   method: "POST",
  //   data: data,
  //   dataType: "json"
  // }).done(function() {
  //   $btn.html('Sent!');
  //   console.log('Call back request emailed to info@finsecptx.com');
  // }).fail(function(jqXHR, textStatus, errorThrown) {
  //   $btn.html('Whoops');
  //   console.error('Call back request failed to send', jqXHR, textStatus, errorThrown);
  // });

  // var keyValues = 'name=Janneman&email=jw@nabu.io&phone_number=0424787666';

  console.log(answers);
  console.log($.param(answers));

  $.ajax({
    type: 'POST',
    // url: 'https://www.webmerge.me/merge/72409/2ygbxs?test=1',
    url: 'https://www.webmerge.me/merge/72409/2ygbxs',
    data: $.param(answers),
    // data: keyValues
    // data: 'name=Janneman&email=jw@nabu.io&phone_number=0424787666',
    // cache: false,
    // dataType: 'json',
    // contentType: "application/json; charset=utf-8"
  }).done(function(data) {
    $btn.html('Sent!');
    goTo('thanks');
    console.log('DONE', data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    $btn.html('Whoops');
    console.error('Failed to submit to webmerge', jqXHR, textStatus, errorThrown);
  });

}

// Fill out the entire form by running lazyPanda() in browser console
function lazyPanda() {
  var data = {
    title: 'Mr',
    name: 'Jan Testing',
    maiden: 'Johannes',
    phone: '0424 787 652',
    email: 'testing@nabu.io',
    street: '82 Flinders',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    UKstreet: '94 Christchurch Rd',
    UKsuburb: 'Winchester',
    UKpostcode: 'SO23 9TE',
    fund1Name: 'UK Pension Fund #1',
    fund1Street: '80 Duke of York Square',
    fund1Suburb: 'London',
    fund1Postcode: 'SW3 4LY',
    dateOfBirth: '16 Oct 1940',
  };
  $.each(data, function(key, value) {
    sessionStorage.setItem(key, value);
    answers[key] = value;
  });
  goTo('review');
}

function goTo(id) {
  if (!location.hash && id === 'prev') {
    window.location = '/';
  }
  var $active = $('.form section' + location.hash);
  id = id === 'next' ? $active.next().attr('id') : id;
  id = id === 'prev' ? $active.prev().attr('id') : id;
  console.log('goTo', id);
  history.pushState(null, null, '#' + id);
  animateToHash();
}

function animateToHash() {
  if ($('.form ' + location.hash).length) {
    $('.form ' + location.hash).show().siblings('section').hide();
  } else {
    history.pushState('', document.title, window.location.pathname);
  }
}

function store(key, value) {
  answers[key] = value;
  sessionStorage.setItem(key, value);
  console.log(answers);
  if (rules[key]) {
    rules[key]();
  }
}

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
    goTo('name-email-again');
  },
  'gender': function() {
    if (sessionStorage.getItem('gender') === 'Female') {
      $('.field.maiden').show();
    } else {
      $('.field.maiden').hide();
    }
  },
  'married': function() {
    if (sessionStorage.getItem('married') === 'Yes') {
      $('.field.spouse').show();
    } else {
      $('.field.spouse').hide();
    }
  },
  'non_concessional_contributions': function() {
    if (sessionStorage.getItem('non_concessional_contributions') === 'Yes') {
      $('.field.contributions').show();
    } else {
      $('.field.contributions').hide();
    }
  },
  'phone-state-age': function() {
    var age = parseInt(answers.age);
    if (Number.isInteger(age)) {
      subscribeToMailChimp();
      goTo('subscribed');
    } else {
      $('#phone-state-age .buttons p').show(300);
    }
  }
};

$(document).ready(function() {

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

  // Submit call back form on contact page to Formspree
  $('#call-back button').on('click', function(e) {
    e.preventDefault();
    var $btn = $(this);
    var $form = $('#call-back');
    $form.find('input, button').prop('disabled', true);
    $btn.html('Sending...');
    var name = $form.find('input').eq(0).val();
    var phone = $form.find('input').eq(1).val();
    var time = $form.find('input').eq(2).val();
    var data = {
      message: 'Someone requested a call back on www.finsecptx.com.au/contact',
      name: $form.find('input').eq(0).val(),
      phone: $form.find('input').eq(1).val(),
      time: $form.find('input').eq(2).val(),
      _subject: 'Please call me | ' + name + ' | ' + phone + ' | ' + time,
      _format: 'plain'
    };
    console.log('Sending call back request ...', data);
    $.ajax({
      url: "https://formspree.io/info@finsecptx.com",
      method: "POST",
      data: data,
      dataType: "json"
    }).done(function() {
      $btn.html('Sent!');
      console.log('Call back request emailed to info@finsecptx.com');
    }).fail(function(jqXHR, textStatus, errorThrown) {
      $btn.html('Whoops');
      console.error('Call back request failed to send', jqXHR, textStatus, errorThrown);
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

  if (PAGE === 'subscribe' || PAGE === 'form') {

    animateToHash();

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

    // Observe all text inputs and populate the answers object on the key matching the name attribute of the text input
    $('input[type="text"], input[type="email"], input[type="range"], select').on('keyup blur change', function() {
      // $(document).on('focus', '.form input[type="text"], .form, #subcribe input[type="email"]', function() {
      var key = $(this).attr('name').toLowerCase();
      var value = $(this).val();
      console.log(key, value);
      store(key, value);
    });

    // On click of option buttons, disable the other buttons, populate attribute to answers
    $('.field.option button').on('click', function() {
      $(this).removeClass('inactive').blur().siblings().addClass('inactive');
      var key = $(this).closest('.field').attr('name').toLowerCase();
      var value = $(this).text();
      store(key, value);
    });

    // Animate a line under text input fields on focus, blur and change. Maintain line if has value.
    $('.form').find('input[type="text"], input[type="email"]').on('focus', function() {
      // var selector = '.form input[type="text"], .form input[type="email"]';
      // $(document).on('focus', selector, function() {
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
    // $('input[placeholder]').closest('.field').addClass('has-placeholder');

    // Add class selected if user selected a value from <select>
    $('.form select').on('change', function() {
      if ($(this).val()) {
        $(this).addClass('selected');
      } else {
        $(this).removeClass('selected');
      }
    });

    // Make time ranges update the adjecent input box
    $('.form input[type="range"]').on('change mousemove', function(e) {
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

    $(document).on('focus', '.field.contributions input', function() {
      var $items = $('.field.contributions li');
      var nth = $items.index($(this).closest('li')) + 1;
      var length = $items.length;
      console.log('focus', nth, length);
      if (nth === length) {
        console.log('equal', nth);
        nth++;
        console.log('equal', nth);
        $('.field.contributions ul').append('<li><span>' + nth + '. </span><div class="field text"><input type="text" name="CONTRIBUTION_' + nth + '" placeholder="DD/MM/YYYYY"></div></li>');
      }
    });

    // Maiden name is hidden until user selects gender
    rules.gender();

    // Spouse is hidden until user selects married
    rules.married();

    // Hide contribution dates until user selects yes I contributed
    rules.non_concessional_contributions();

    $('#review button.submit').on('click', function() {
      submitFormToWebMerge();
    });

  }

});
