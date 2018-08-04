import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { run } from '@ember/runloop';
import layout from './template';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default Component.extend({
  layout,
  classNames: ['create-button'],
  type: 'text',

  *fade({ insertedSprites, removedSprites }) {
    insertedSprites.map(fadeIn);
    removedSprites.map(fadeOut);
    yield;
  },

  destroy() {
    document.body.removeEventListener('touchstart', this.documentClick);
    document.body.removeEventListener('click', this.documentClick);
    this._super();
  },

  model: computed('field', 'value', function () {
    return {
      [this.field]: this.value
    };
  }),

  actions: {
    submit(model, changes) {
      let payload = Object.assign({}, model, changes);
      return this.onsubmit(payload)
        .catch(() => {})
        .finally(() => set(this, 'isCreating', false));
    },

    create(evt) {
      evt.preventDefault();
      set(this, 'isCreating', true);

      this.documentClick = (evt) => {
        if (this.element != null &&
            this.element !== evt.target &&
            !this.element.contains(evt.target)) {
          run(() => {
            set(this, 'isCreating', false);
          });
        }
      };
      document.body.addEventListener('mousedown', this.documentClick);
      document.body.addEventListener('touchstart', this.documentClick);
    }
  }
}).reopenClass({
  positionalParams: ['field']
});
