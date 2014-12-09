<?php

class context_takeover_reaction extends context_reaction {
  public function options_form($context) {
    $values = $this->fetch_from_context($context);
    $form['#tree'] = TRUE;
    $form['id'] = array(
      '#type' => 'textfield',
      '#title' => t('ID'),
      '#default_value' => isset($values['id']) ? $values['id'] : (!empty($context->name) ? $context->name : NULL),
      '#description' => t('The identifier for this takeover, to force a new takeover for all visitors, change this.'),
    );
    $form['content'] = array(
      '#type' => 'text_format',
      '#title' => t('Content'),
      '#default_value' => isset($values['content']['value']) ? $values['content']['value'] : '',
      '#format' => isset($values['content']['format']) ? $values['content']['format'] : NULL,
    );
    $form['cookie_expires'] = array(
      '#type' => 'textfield',
      '#title' => t('Expires (days)'),
      '#default_value' => isset($values['cookie_expires']) ? $values['cookie_expires'] : 31,
      '#description' => t('Day count before the takeover banner is displayed a second time for the same user.'),
    );
    $form['delay'] = array(
      '#type' => 'textfield',
      '#title' => t('Takeover delay (seconds)'),
      '#default_value' => isset($values['delay']) ? $values['delay'] : 0,
      '#description' => t('Seconds to wait until the takover is displayed to the user.'),
    );
    return $form;
  }

  public function execute() {
    $contexts = $this->get_contexts();
    foreach ($contexts as $context) {
      if (!empty($context->reactions[$this->plugin])) {
        $values = $context->reactions[$this->plugin];
        if ($content = $values['content']['value']) {
          context_takeover($content, array(
            'id' => $values['id'],
            'expires' => $values['cookie_expires'],
            'delay' => $values['delay'],
          ));
        }
      }
    }
  }
}
