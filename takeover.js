(function($) {
  Drupal.behaviors.takeover = {
    attach: function (context, settings) {
      settings = settings.takeover || Drupal.settings.takeover;
      if (this.processed) return;
      if (!settings) return;
      if (!settings.burst && !Drupal.takeover.isApplicable(settings.id)) return;
      this.processed = true;

      console.debug('takeover overlay: open in %s sec', settings.delay);

      setTimeout(function() {
        Drupal.takeover.init(settings);
      }, (~~settings.delay || 0) * 1000);
    }
  };

  Drupal.takeover = Drupal.takeover || {};

  Drupal.takeover.isApplicable = function (id) {
    var user_id = $.cookie('takeover_' + id)
      , value = user_id !== id;

    if (!value) console.debug('takeover overlay: not applicable');
    return value;
  };

  Drupal.takeover.init = function (settings) {
    console.debug('takeover overlay: initializing.', settings);
    $('body').addClass('takeover-open');
    if (!window.matchMedia || (window.matchMedia && window.matchMedia('(min-width: 1024px)').matches)) {
      $.colorbox($.extend({}, Drupal.settings.colorbox || {}, {
        html: settings.content,
        initialWidth: 0,
        initialHeight: 0,
        fixed: true,
        onLoad: function() {
          console.debug('takeover overlay: loading');
        },
        onComplete: function() {
          console.debug('takeover overlay: loaded');
          if (!this.onCompleteDone) {
            this.onCompleteDone = true;
            // Trigger a resize as there might be responsive images.
            $.colorbox.load();
          }
        },
        onClosed: function() {
          console.debug('takeover overlay: closed');
          $('body').removeClass('takeover-open');
        }
      }));
      $.cookie('takeover_' + settings.id, settings.id, { expires: ~~settings.expires || 0, path: '/' });
    } else {
      console.debug('takeover overlay: screen too small.');
    }
  };
}(jQuery));
