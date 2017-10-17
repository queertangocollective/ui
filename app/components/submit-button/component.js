import Component from '@ember/component';
import { set, get } from '@ember/object';
import RSVP from 'rsvp';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  tagName: 'button',

  submit: task(function *(submit) {
    this.$().css('width', this.$().outerWidth());
    set(this, 'isProcessing', true);
    try {
      yield RSVP.all([submit(), timeout(500)]);
    } finally {
      set(this, 'isProcessing', false);
      yield timeout(500);
      this.$().removeAttr('style');
    }
  }),

  click(evt) {
    evt.preventDefault();
    get(this, 'submit').perform(get(this, 'onsubmit'));
    return false;
  }
});
