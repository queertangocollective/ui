import Component from '@ember/component';
import { get, set } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  tagName: '',

  actions: {
    submit(value) {
      return this.onsubmit({ [this.field]: value })
        .catch(() => {})
        .finally(() => set(this, 'isCreating', false));
    },
    create(evt) {
      evt.preventDefault();
      set(this, 'isCreating', true);
    }
  }
}).reopenClass({
  positionalParams: ['field']
});
