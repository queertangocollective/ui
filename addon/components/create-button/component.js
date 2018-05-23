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
  },

  destroy() {
    document.body.removeEventListener('click', this.documentClick);
    this._super();
  },

  displayValue: computed('value', {
    get() {
      return this.value;
    },
    set(_, value) {
      return value;
    }
  }),

  actions: {
    submit(value) {
      return this.onsubmit({ [this.field]: value })
        .catch(() => {})
        .finally(() => set(this, 'isCreating', false));
    },

    create(evt) {
      evt.preventDefault();
      set(this, 'isCreating', true);

      this.documentClick = (evt) => {
        if (this.element !== evt.target &&
            !this.element.contains(evt.target)) {
          run(() => {
            set(this, 'isCreating', false);
          });
        }
      };
      document.body.addEventListener('mousedown', this.documentClick);
    }
  }
}).reopenClass({
  positionalParams: ['field']
});
