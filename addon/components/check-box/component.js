import Component from '@ember/component';
import { computed } from '@ember/object';
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
      this.onchange(evt.target.checked);
    }
  }
});
