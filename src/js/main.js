$(document).ready(function() {

  // Animation logic for diagram on About page
  var $process = $('#about #process');
  $process.find('h3, .img, .desc').on('click mouseenter', function() {
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
