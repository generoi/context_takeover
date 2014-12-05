(function($) {
  Drupal.behaviors.takeover = {
    attach: function (context, settings) {
      settings = settings.takeover || Drupal.settings.takeover;
      if (this.processed) return;
      if (!settings) return;
      if (!settings.burst && !Drupal.takeover.isApplicable(settings.id)) return;
      this.processed = true;

      console.debug('initalizing context takeover overlay.');
      Drupal.takeover.init(settings);
    }
  };

  Drupal.takeover = Drupal.takeover || {};

  Drupal.takeover.isApplicable = function (id) {
    var user_id = $.cookie('takeover')
      , value = user_id !== id;

    console.debug('context takeover displayed before: %s', value ? 'true' : 'false');
    return value;
  };

  Drupal.takeover.init = function (settings) {
    $('body').addClass('takeover-open');
    if (!window.matchMedia || (window.matchMedia && window.matchMedia('(min-width: 1024px)').matches)) {
      $.colorbox($.extend({}, Drupal.settings.colorbox || {}, {
        html: settings.content,
        initialWidth: 0,
        initialHeight: 0,
        fixed: true,
        onLoad: function() {
          console.debug('context takeover overlay loading.');
        },
        onComplete: function() {
          // Trigger a resize as there might be responsive images.
          $.colorbox.resize();
        },
        onClosed: function() {
          console.debug('context takeover overlay closed.');
          $('body').removeClass('takeover-open');
        }
      }));
      $.cookie('takeover', settings.id, { expires: settings.expires, path: '/' });
    } else {
      console.debug('did not load context takeover layover as screen was too small.');
    }
  };
}(jQuery));
