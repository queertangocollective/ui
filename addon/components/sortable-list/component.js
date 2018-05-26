import Component from '@ember/component';
import { set, computed } from '@ember/object';
import RSVP from 'rsvp';
import layout from './template';
import move from 'ember-animated/motions/move';
import opacity from 'ember-animated/motions/opacity';
import { easeInOut as easing } from 'ember-animated/easings/cosine';

export default Component.extend({

  layout,

  classNames: ['sortable-list'],

  icon: 'sad',

  isShowingSorting: computed('sort', {
    get() {
      return false;
    },
    set(_, value) {
      return value;
    }
  }),

  hasMore: computed('total', 'model.length', {
    get() {
      return this.total > this.model ? this.model.length : 0;
    }
  }),

  duration: 250,

  fade: function* ({ insertedSprites, removedSprites }) {
    yield RSVP.all([
      ...insertedSprites.map(sprite => opacity(sprite, { from: 0, to: 1 })),
      ...removedSprites.map(sprite => opacity(sprite, { from: 1, to : 0 }))
    ]);
  },

  shuffle: function* ({ insertedSprites, keptSprites, removedSprites }) {
    if (removedSprites.length) {
      yield RSVP.all(removedSprites.map(sprite => {
        return opacity(sprite, { from: 1, to: 0, easing });
      }));
    }
    if (keptSprites.length) {
      yield RSVP.all(keptSprites.map(sprite => {
        sprite.applyStyles({ zIndex: 1 });
        return move(sprite);
      }));
    }
    if (insertedSprites.length) {
      yield RSVP.all(insertedSprites.map(sprite => {
        sprite.scale(0.8);
        return opacity(sprite, { from: 0, to: 1, easing });
      }));
    }
  },

  actions: {
    loadMore(offset) {
      return this.load(offset).then(({ model, meta }) => {
        set(this, 'rows', [...this.rows.toArray(), ...model.toArray()]);
        set(this, 'total', meta.page.total);
      });
    }
  }
});
