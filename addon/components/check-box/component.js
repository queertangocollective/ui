import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'span',
  classNames: ['check-box'],
  inputId: computed({
    get() {
      return `checkbox-${guidFor(this)}`;
    }
  }),

  actions: {
    change(evt) {
      get(this, 'onchange')(evt.target.checked);
    }
  }
});
