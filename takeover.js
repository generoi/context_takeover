(function($) {
  Drupal.behaviors.takeover = {
    attach: function (context, settings) {
      settings = settings.takeover || Drupal.settings.takeover;
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
      $.colorbox($.extend({}, Drupal.settings.colorbox || {}, {
        html: settings.content,
        initialWidth: 0,
        initialHeight: 0,
        fixed: true,
        onComplete: function() {
          // Trigger a resize as there might be responsive images.
          $.colorbox.resize();
        },
        onClosed: function() {
          $('body').removeClass('takeover-open');
        }
      }));
      $.cookie('takeover', settings.id, { expires: settings.expires, path: '/' });
    }
  };
}(jQuery));
