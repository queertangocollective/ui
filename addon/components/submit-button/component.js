import Component from '@ember/component';
import { set, get } from '@ember/object';
import RSVP from 'rsvp';
import { task, timeout } from 'ember-concurrency';
import layout from './template';
import { getLayout } from 'dom-ruler';

export default Component.extend({

  tagName: 'button',

  layout,

  attributeBindings: ['type'],

  classNames: ['submit-button'],

  type: 'submit',

  submit: task(function *(submit) {
    let width = get(this, 'element').getBoundingClientRect().width;
    let innerWidth = getLayout(get(this, 'element')).content.width;
    get(this, 'element').style.width = width + 'px';
    set(this, 'isProcessing', true);
    try {
      yield timeout(1);
      let children = get(this, 'element').querySelectorAll('.liquid-child');
      children.forEach((child) => {
        child.style.width = innerWidth + 'px';
      });
      yield RSVP.all([submit(), timeout(500)]);
    } finally {
      set(this, 'isProcessing', false);
      yield timeout(500);
      get(this, 'element').style.width = null;
    }
  }),

  click(evt) {
    evt.preventDefault();
    if (get(this, 'isProcessing')) return false;

    get(this, 'submit').perform(get(this, 'onsubmit'));
    return false;
  }
});
