import Component from 'ember-animated/components/animated-container';
import { set, get } from '@ember/object';
import RSVP from 'rsvp';
import { task, timeout } from 'ember-concurrency';
import layout from './template';

export default Component.extend({

  tagName: 'button',

  layout,

  attributeBindings: ['type'],

  classNames: ['submit-button'],

  classNameBindings: ['isProcessing'],

  type: 'submit',

  duration: 200,

  submit: task(function *(submit) {
    set(this, 'isProcessing', true);
    try {
      yield RSVP.all([submit(), timeout(500)]);
    } finally {
      set(this, 'isProcessing', false);
    }
  }),

  click(evt) {
    evt.preventDefault();
    if (get(this, 'isProcessing')) return false;

    get(this, 'submit').perform(get(this, 'onsubmit'));
    return false;
  }
});
