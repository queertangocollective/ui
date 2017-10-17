import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default Component.extend({
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
