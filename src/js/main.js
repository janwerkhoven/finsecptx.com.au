isProduction = location.host === 'www.finsecptx.com.au' ? true : false;
environmentLabel = isProduction ? '[LIVE WEBSITE]' : '[STAGING WEBSITE]' + ' ';

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
  // var url = 'https://www.webmerge.me/merge/72409/2ygbxs'; // Live
  if (isProduction) {
    url = 'https://www.webmerge.me/merge/72409/2ygbxs'; // Live
  }
  debugger;
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
    _subject: environmentLabel + 'Someone requested a call-back',
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
    _subject: environmentLabel + 'Someone completed the eligibility form',
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
    _subject: environmentLabel + 'Someone subscribed!',
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
  dataFormSpree.message = 'Someone completed the pension transfer enquiry on www.finsecptx.com.au.';
  dataFormSpree._subject = environmentLabel + 'Someone completed the pension transfer enquiry!';
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

// Cheat code to show all form sections at once
function wisePanda() {
  $('#form section').show();
  return true;
}

// Cheat code to fill out the entire form and go to review section
function lazyPanda() {
  var data = {
    title: "Mr",
    name: "Jan Testing",
    age: "82",
    comments: "I would like to choose how to invest my pension please.",
    country: "Australia",
    date_arrival_australia_stay: "12/10/2012",
    date_last_uk_residency: "11/10/2012",
    date_of_birth: "16/10/1986",
    email: "jan.testing@nabu.io",
    gender: "Male",
    made_nc_contributions: "No",
    married: "No",
    message: "Someone completed the pension transfer enquiry on www.finsecptx.com.au.",
    name: "Jan Testing",
    objectives: "Having your pension in the country you are living in + Avoiding currency risk on your pension benefits + Controlling or influencing the investments under your pension arrangements",
    occupation: "Web Developer",
    pension_fund_1: "UK Pension #1",
    pension_fund_1_country: "United Kingdom",
    pension_fund_1_insurance: "1234567 1234567",
    pension_fund_1_period: "January 1901 - December 1999",
    pension_fund_1_postcode: "SW3 4LY",
    pension_fund_1_reference: "12345 YTR",
    pension_fund_1_street: "80 Duke of York Square",
    pension_fund_1_suburb: "London",
    pension_fund_2: "Brit Pension #2",
    pension_fund_2_insurance: "1234567 768999",
    pension_fund_2_period: "February 2001 - August 2016",
    pension_fund_2_postcode: "E14",
    pension_fund_2_reference: "12345 XRR",
    pension_fund_2_street: "51 Strafford Street",
    pension_fund_2_suburb: "London",
    pension_fund_3: "Employer pension #3",
    phone: "04247887652",
    postcode: "3000",
    residency: "Permanent",
    state: "VIC",
    street: "82 Flinder St",
    suburb: "Melbourne",
    super_fund_1: "Kinetic Super #1",
    super_fund_1_balance: "82.000",
    super_fund_1_owner: "Myself",
    super_fund_2: "Supernicesuper #2",
    super_fund_2_balance: "54.000",
    super_fund_2_owner: "Myself",
    taxable_income_gt_18200: "Yes",
    title: "Mr",
    uk_country: "United Kingdom",
    uk_postcode: "SO23 9TE",
    uk_street: "94 Christchurch Rd",
    uk_suburb: "Winchester",
    country: "Australia",
    uk_country: "United Kingdom",
    pension_fund_1_country: "United Kingdom"
  };
  $.each(data, function(key, value) {
    sessionStorage.setItem(key, value);
    answers[key] = value;
  });
  goTo('review');
  return data;
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
  window.scrollTo(0, 0);
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
  console.log(key, value);
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
    submitSubscription();
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
  'made_nc_contributions': function() {
    if (sessionStorage.getItem('made_nc_contributions') === 'Yes') {
      $('.group.nc-contributions').show();
    } else {
      $('.group.nc-contributions').hide();
    }
  },
  'pension-funds': function() {
    if (!answers.pension_fund_1 && !answers.pension_fund_2 && !answers.pension_fund_3) {
      $('#pension-funds .errors p').text('Please name your pension fund').show(300);
    } else {
      return true;
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

    goTo('hello');

    // animateToHash();

    // wisePanda();

    $(window).on('popstate', function(e) {
      animateToHash();
    });

    $(document).on('click', 'section button.next', function() {
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

    $(document).on('click', 'section button.back', function() {
      var target = $(this).attr('for');
      if (target) {
        goTo(target);
      } else {
        goTo('prev');
      }
    });

    // Observe all text inputs and populate the answers object on the key matching the name attribute of the text input
    // $('input[type="text"], input[type="email"], input[type="range"], select, textarea').on('keyup blur change', function() {
    $(document).on('keyup blur change', 'input[type="text"], input[type="email"], input[type="range"], select, textarea', function() {
      var key = $(this).attr('name');
      var value = $(this).val();
      if (key && value) {
        store(key.toLowerCase(), value);
        $('input[name="' + key + '"]').not($(this)).val(value).trigger('sync');
        $('select[name="' + key + '"]').not($(this)).val(value).trigger('sync');
        $('span[name="' + key + '"]').text(value);
      }
      $(this).closest('section').find('.errors p').hide(300);
    });

    // Trigger all fields with pre-filled info to be stored
    $('input[type="text"][value]').trigger('change');

    // $('input[type="email"]').on('keyup, blur, change, sync', function() {
    //   console.log($(this).val().length, $(this));
    //   if ($(this).val().length > 10) {
    //     console.log('BIGGER');
    //     $(this).closest('.field').addClass('small-font');
    //   } else {
    //     $(this).removeClass('small-font');
    //   }
    // });

    // On click of option buttons, disable the other buttons, populate attribute to answers
    $(document).on('click', '.field.option button', function() {
      $(this).removeClass('inactive').blur().siblings().addClass('inactive');
      var key = $(this).closest('.field').attr('name').toLowerCase();
      var value = $(this).text();
      store(key, value);
    });

    // Animate a line under text input fields on focus, blur and change. Maintain line if has value.
    $('.form').find('input[type="text"], input[type="email"]').on('focus', function() {
      $(this).parent().addClass('focus');
    }).on('blur', function() {
      $(this).parent().removeClass('focus');
    }).on('change sync', function() {
      if ($(this).val()) {
        $(this).parent().addClass('has-value');
      } else {
        $(this).parent().removeClass('has-value');
      }
    });

    // Add class selected if user selected a value from <select>
    $('.form select').on('change sync', function() {
      if ($(this).val()) {
        $(this).addClass('selected');
      } else {
        $(this).removeClass('selected');
      }
    });

    // Logic for aggregating a list of checkboxes into a single value
    $('.checkboxes button').on('click', function() {
      $(this).toggleClass('checked').blur();
      var key = $(this).closest('.field').attr('name');
      var value = '';
      $(this).closest('.field').find('button.checked').each(function(i, element) {
        if (i > 0) {
          value += ' + ';
        }
        value += $(this).html();
      });
      store(key.toLowerCase(), value);
      $(this).closest('section').find('.errors p').hide(300);
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
      goTo('prev');
    });

    // Add input fields on focus of last field in #uk-funds
    $(document).on('focus keyup blur change', '.group.numbered.super-funds input', function() {
      var $group = $(this).closest('.group');
      var $inputs = $group.find('input');
      var i = $inputs.length + 1;
      var $last = $inputs.last();
      var isLast = $(this).attr('name') === $last.attr('name') ? true : false;
      if (isLast) {
        $last.parent().after('<div class="field text"><span>' + i + '.</span><input type="text" name="SUPER_FUND_' + i + '" tabindex="' + i + '"></div>');
      }
      var name = $(this).attr('name');
      var id = name.toLowerCase().replace(/_/g, '-');
      var hasValue = $(this).val() ? true : false;
      var isNew = $('#' + id).length < 1 ? true : false;
      if (hasValue && isNew) {
        console.log('CREATING', name);
        $('#objectives').before('<section id="' + id + '">' + $('#super-fund-x').html().replace(/SUPER_FUND_[0-9]/g, name) + '</section>');
      }
      if (!hasValue) {
        console.log('REMOVING', name);
        $('#' + id).remove();

        // TODO: remove all assoicated keys and values

      }
    });

    // Add input fields on focus of last field in #pension-funds
    $(document).on('focus keyup blur change', '.group.numbered.pension-funds input', function() {
      var $group = $(this).closest('.group');
      var $inputs = $group.find('input');
      var i = $inputs.length + 1;
      var $last = $inputs.last();
      var isLast = $(this).attr('name') === $last.attr('name') ? true : false;
      if (isLast) {
        $last.parent().after('<div class="field text"><span>' + i + '.</span><input type="text" name="PENSION_FUND_' + i + '" tabindex="' + i + '"></div>');
      }
      var name = $(this).attr('name');
      var id = name.toLowerCase().replace(/_/g, '-');
      var hasValue = $(this).val() ? true : false;
      var isNew = $('#' + id).length < 1 ? true : false;
      if (hasValue && isNew) {
        console.log('CREATING', name);
        $('#end-part-three').before('<section id="' + id + '">' + $('#pension-fund-x').html().replace(/PENSION_FUND_[0-9]/g, name) + '</section>');
        $('#review ul').append('<li id="' + id + '-letter">' + $('#letter-of-authority').html().replace(/PENSION_FUND_[0-9]/g, name) + '</section>');
      }
      if (!hasValue) {
        console.log('REMOVING', name);
        $('#' + id).remove();
        $('#' + id + '-letter').remove();

        // TODO: remove all assoicated keys and values

      }
    });

    // Agregate #nc-contributions inputs into one
    $(document).on('focus keyup blur change', '.group.numbered.nc-contributions input', function() {
      var key = $(this).closest('.group').attr('name');
      var value = '';
      $(this).closest('.group').find('.amount input').each(function(i, element) {
        if ($(this).val()) {
          if (i > 0) {
            value += ' + ';
          }
          value += '$' + $(this).val() + ' (' + $(this).parent().next().find('input').val() + ')';
        }
      });
      store(key.toLowerCase(), value);
    });

    // Add 2 fields to #nc-contributions on click button
    $('.group.numbered button').on('click', function() {
      var i = $(this).closest('.group').find('.amount').length + 1;
      $(this).before('<div class="field text amount"><span>' + i + '.</span><input type="text" tabindex="' + i + '" placeholder="Amount $"></div><div class="field text"><input type="text" tabindex="' + i + '" placeholder="Date"></div>');
    });

    // Hide maiden name until gender = female
    rules.gender();

    // Hide spouse until married = yes
    rules.married();

    // Hide contribution dates until user selects yes I contributed
    rules.made_nc_contributions();

  }

});
