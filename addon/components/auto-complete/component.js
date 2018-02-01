import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { resolve } from 'rsvp';
import layout from './template';

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
