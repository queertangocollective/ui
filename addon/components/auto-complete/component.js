import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { resolve } from 'rsvp';
import layout from './template';
import RSVP from 'rsvp';
import move from 'ember-animated/motions/move';
import { fadeOut, fadeIn } from 'ember-animated/motions/opacity';

export default Component.extend({
  layout,
  classNames: ['auto-complete'],

  searchId: computed(function () {
    return 'search-' + guidFor(this);
  }),

  didReceiveAttrs() {
    resolve(get(this, 'value')).then((value) => {
      set(this, 'displayValue', value);
    });
  },

  duration: 200,

  fade: function* ({ insertedSprites, removedSprites }) {
    yield RSVP.all([
      ...insertedSprites.map(fadeIn),
      ...removedSprites.map(fadeOut)
    ]);
  },

  shuffle: function* ({ insertedSprites, keptSprites, removedSprites }) {
    if (removedSprites.length) {
      yield RSVP.all(removedSprites.map(fadeOut));
    }
    if (keptSprites.length) {
      yield Promise.all(keptSprites.map(sprite => {
        sprite.applyStyles({ zIndex: 1 });
        return RSVP.all([
          fadeIn(sprite),
          move(sprite)
        ]);
      }));
    }
    if (insertedSprites.length) {
      insertedSprites.map(fadeOut);
    }
  },

  actions: {
    query(query) {
      if (query === '') {
        get(this, 'onchange')(null);
        set(this, 'options', [])
      } else {
        get(this, 'onquery')({ text: query }).then((options) => {
          set(this, 'options', options);
        });
      }
    },

    change(value) {
      get(this, 'onchange')(value);
      set(this, 'options', []);
    }
  }

});
