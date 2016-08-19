isProduction = location.host === 'www.finsecptx.com.au' ? true : false;

answers = {};

// The AJAX request to Formspree
function formSpree(data) {
  var deferred = $.Deferred();
  $.ajax({
    url: 'https://formspree.io/info@finsecptx.com',
    method: 'POST',
    data: data,
    dataType: 'json'
  }).done(function(data) {
    deferred.resolve('success');
    console.log('AJAX success', data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    deferred.reject('fail');
    console.error('AJAX fail', jqXHR, textStatus, errorThrown);
  });
  return deferred.promise();
}

// The AJAX request to Webmerge
function webMerge(data) {
  var deferred = $.Deferred();
  var url = 'https://www.webmerge.me/merge/72409/2ygbxs?test=1'; // Testing
  if (isProduction) {
    url = 'https://www.webmerge.me/merge/72409/2ygbxs'; // Live
  }
  $.ajax({
    type: 'POST',
    url: url,
    data: $.param(answers),
  }).done(function(data) {
    deferred.resolve('success');
    console.log('AJAX success', data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    deferred.reject('fail');
    console.error('AJAX fail', jqXHR, textStatus, errorThrown);
  });
  return deferred.promise();
}

// The AJAX request to Mailchimp
function mailChimp(data) {
  var deferred = $.Deferred();
  var url = '//finsecptx.us13.list-manage.com/subscribe/post-json?u=500670fda51c3a1aa312eecfa&id=0d0bbdfa29&c=?'; // Testing
  if (isProduction) {
    url = '//finsecptx.us13.list-manage.com/subscribe/post-json?u=500670fda51c3a1aa312eecfa&id=202853ccf3&c=?'; // Live
  }
  $.ajax({
    type: 'GET',
    url: url,
    data: $.param(data),
    cache: false,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8'
  }).done(function(data) {
    deferred.resolve('success');
    console.log('AJAX success', data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    deferred.reject('fail');
    console.error('AJAX fail', jqXHR, textStatus, errorThrown);
  });
  return deferred.promise();
}

// Submit call-back to Forspree
function submitCallBack() {
  var $form = $('#call-back');
  var $btn = $form.find('button');
  $form.find('input, button').prop('disabled', true);
  $btn.html('Sending...');
  var data = {
    message: 'Someone requested a call-back on www.finsecptx.com.au.',
    name: $form.find('input').eq(0).val(),
    phone: $form.find('input').eq(1).val(),
    time: $form.find('input').eq(2).val(),
    _subject: '[WEBSITE] Someone requested a call-back',
    _format: 'plain'
  };
  console.log('Submitting call-back request to FormSpree ...', data);
  $.when(formSpree(data)).then(function(status) {
    $btn.html('Sent!');
  }, function(status) {
    $btn.html('Whoops');
  });
}

// Submit first section of the big form, preliminary, to Formspree
function submitEligbility() {
  var data = {
    message: 'Someone completed the eligibility form on www.finsecptx.com.au.',
    _subject: '[WEBSITE] Someone completed the eligibility form',
    _format: 'plain'
  };
  var keys = ['title', 'name', 'email', 'phone', 'state', 'age'];
  $.each(keys, function(i, key) {
    data[key] = sessionStorage.getItem(key) || '-';
  });
  console.log('Submitting eligibility results to FormSpree ...', data);
  formSpree(data);
}

// Submit the keep me informed subscription to Mailchimp and Formspree
function submitSubscription() {
  var $btn = $('button.subscribe');
  $btn.html('Sending...').prop('disabled', true);
  var keys = ['title', 'name', 'email', 'phone', 'state', 'age'];
  var dataMailChimp = {};
  var dataFormSpree = {
    message: 'Someone subscribed to your "Keep me informed" Mailchimp mailing list via www.finsecptx.com.au. Before this subscription appears in your Mailchimp account this person needs to click the big "Yes subscribed me" button in the email that has been sent to them.',
    _subject: '[WEBSITE] Someone subscribed!',
    _format: 'plain'
  };
  $.each(keys, function(i, key) {
    dataFormSpree[key] = dataMailChimp[key.toUpperCase()] = sessionStorage.getItem(key) || '-';
  });
  console.log('Submitting subscription to FormSpree ...', dataFormSpree);
  formSpree(dataFormSpree);
  console.log('Submitting subscription to Mailchimp ...', dataMailChimp);
  $.when(mailChimp(dataMailChimp)).then(function(status) {
    $btn.html('Sent!');
    goTo('subscribed');
    $('.form #subscribed p.email em').text(answers.email);
  }, function(status) {
    $btn.html('Whoops');
  });
}

// Submit the big pension transfer enquiry form to Webmerge and Formspree
function submitEnquiry() {
  var $btn = $('#review button.next');
  $btn.html('Sending...').prop('disabled', true);
  var dataWebMerge = answers;
  var dataFormSpree = answers;
  dataFormSpree.message = 'Someone subscribed to your "Keep me informed" Mailchimp mailing list via www.finsecptx.com.au. Before this subscription appears in your Mailchimp account this person needs to click the big "Yes subscribed me" button in the email that has been sent to them.';
  dataFormSpree._subject = '[WEBSITE] Someone subscribed!';
  dataFormSpree._format = 'plain';
  console.log('Submitting enquiry to FormSpree ...', dataFormSpree);
  formSpree(dataFormSpree);
  console.log('Submitting enquiry to WebMerge ...', dataWebMerge);
  $.when(webMerge(dataWebMerge)).then(function(status) {
    $btn.html('Sent!');
    goTo('thanks');
  }, function(status) {
    $btn.html('Whoops');
  });
}

// Fill out the entire form by entering lazyPanda() in browser console
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
    if (answers.state) {
      var age = parseInt(answers.age);
      if (Number.isInteger(age)) {
        submitEligbility();
        if (age >= 55) {
          goTo('eligible');
        } else {
          goTo('not-yet-eligible');
        }
      } else {
        $('#state-age .errors p').text('Please choose age').show(300);
      }
    } else {
      $('#state-age .errors p').text('Please choose state').show(300);
    }
  },
  'phone-state-age': function() {
    if (answers.state) {
      var age = parseInt(answers.age);
      if (Number.isInteger(age)) {
        submitSubscription();
      } else {
        $('#phone-state-age .errors p').text('Please choose age').show(300);
      }
    } else {
      $('#phone-state-age .errors p').text('Please choose state').show(300);
    }
  },
  'email-check': function() {
    // $('#subscribed p.email em').text(sessionStorage.getItem('email'));
    submitSubscription();
  },
  'eligible': function() {
    goTo('start-enquiry');
  },
  'start-enquiry': function() {
    // keys = ['title', 'name', 'email', 'phone'];
    // $.each(keys, function(i, v) {
    //   $('#name-email-again ' + 'input[name="' + v.toUpperCase() + '"]').val(sessionStorage.getItem(v));
    // });
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
  'review': function() {
    submitEnquiry();
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

  // Submit call-back form on contact page to Formspree
  $('#contact #call-back button').on('click', function() {
    submitCallBack();
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

    $('section button.next').on('click', function() {
      var thisSection = $(this).closest('section');
      if (thisSection.isValid()) {
        var target = $(this).attr('for');
        if (target) {
          goTo(target);
        } else {
          goTo('next');
        }
      }
    });

    $('section button.back').on('click', function() {
      var target = $(this).attr('for');
      if (target) {
        goTo(target);
      } else {
        goTo('prev');
      }
    });

    // Observe all text inputs and populate the answers object on the key matching the name attribute of the text input
    $('input[type="text"], input[type="email"], input[type="range"], select').on('keyup blur change', function() {
      // $(document).on('focus', '.form input[type="text"], .form, #subcribe input[type="email"]', function() {
      var key = $(this).attr('name').toLowerCase();
      var value = $(this).val();
      console.log(key, value);
      store(key, value);
      $(this).closest('section').find('.errors p').hide(300);
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

  }

});
