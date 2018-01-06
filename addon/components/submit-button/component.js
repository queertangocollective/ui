import Component from '@ember/component';
import { set, get } from '@ember/object';
import RSVP from 'rsvp';
import { task, timeout } from 'ember-concurrency';
import layout from './template';

export default Component.extend({
  tagName: 'button',

  attributeBindings: ['type'],

  type: 'submit',

  submit: task(function *(submit) {
    get(this, 'element').styles.width = get(this, 'element').getBoundingClientRect().width + 'px';
    set(this, 'isProcessing', true);
    try {
      yield RSVP.all([submit(), timeout(500)]);
    } finally {
      set(this, 'isProcessing', false);
      yield timeout(500);
      get(this, 'element').styles.width = null;
    }
  }),

  click(evt) {
    evt.preventDefault();
    get(this, 'submit').perform(get(this, 'onsubmit'));
    return false;
  }
});
