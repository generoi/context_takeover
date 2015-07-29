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
        Drupal.takeover.fn[settings.overlay_type || 'overlay'](settings);
        $.cookie('takeover_' + settings.id, settings.id, { expires: ~~settings.expires || 0, path: '/' });
      }, (~~settings.delay || 0) * 1000);
    }
  };

  Drupal.takeover = Drupal.takeover || {};

  Drupal.takeover.isApplicable = function (id) {
    var user_id = $.cookie('takeover_' + id)
      , large_screen = window.matchMedia && window.matchMedia('(min-width: 1024px)').matches
      , value = (user_id !== id) && large_screen;

    if (!value) console.debug('takeover overlay: not applicable');
    return value;
  };

  Drupal.takeover.fn = Drupal.takeover.fn || {};

  Drupal.takeover.fn.footer = function (settings) {
    $('body').addClass('takeover-open');
    $([
        '<div class="takeover-footer-wrapper">'
      , '<div class="takeover-footer">'
      , '<div class="takeover-content">'
      , settings.content
      , '</div>'
      , '<a href="#" class="close">' + Drupal.t('Sulje ikkuna') + '</a>'
      , '</div>'
      , '</div'
    ].join('')).appendTo($('body'));
    $(document).on('click', '.takeover-footer .close', function(e) {
      if (e) e.preventDefault();
      $('.takeover-footer-wrapper').remove();
    });
  };

  Drupal.takeover.fn.overlay = function (settings) {
    console.debug('takeover overlay: initializing.', settings);
    $('body').addClass('takeover-open');
    $.colorbox($.extend({}, Drupal.settings.colorbox || {}, {
      html: settings.content,
      initialWidth: 0,
      initialHeight: 0,
      fixed: true,
      onLoad: function() {
        console.debug('takeover overlay: loading');
      },
      onComplete: function() {
        // @TODO the content is actually not loaded, we should hide colorbox overlay until it is.
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
  };
}(jQuery));
