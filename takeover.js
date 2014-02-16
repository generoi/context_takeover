(function($) {
  Drupal.behaviors.takeover = {
    attach: function (context, settings) {
      settings = settings.takeover || Drupal.settings.takeover;
      console.log(settings);
      if (this.processed) return;
      if (!settings) return;
      if (!settings.burst && !Drupal.takeover.isApplicable(settings.id)) return;
      this.processed = true;

      Drupal.takeover.init(settings);
    }
  };

  Drupal.takeover = Drupal.takeover || {};

  Drupal.takeover.isApplicable = function (id) {
    var user_id = $.cookie('takeover');
    return user_id !== id;
  };

  Drupal.takeover.init = function (settings) {
    $('body').addClass('takeover-open');
    if (!window.matchMedia || (window.matchMedia && window.matchMedia('(min-width: 1024px)').matches)) {
      $.colorbox({ html: settings.content });
      $(document).bind('cbox_closed', function() {
        $('body').removeClass('takeover-open');
      });
      $.cookie('takeover', settings.id, { expires: settings.expires, path: '/' });
    }
  };
}(jQuery));