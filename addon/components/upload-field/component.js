import Component from '@ember/component';
import { set, get } from '@ember/object';
import RSVP from 'rsvp';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['upload-field'],
  classNameBindings: ['file:present'],

  multiple: false,

  didReceiveAttrs() {
    let value = get(this, 'value');
    if (value) {
      if (value.then || get(value, 'store')) {
        RSVP.resolve(value).then((file) => {
          if (file) {
            set(this, 'file', file);
          } else {
            set(this, 'file', null);
          }
        });
      } else {
        set(this, 'isLoading', true);
        value.readAsDataURL().then((url) => {
          set(this, 'isLoading', false);
          set(this, 'file', {
            url,
            name: get(value, 'name')
          });
        });
      }
    } else {
      set(this, 'file', null);
    }
  },

  actions: {
    remove(evt) {
      get(this, 'onchange')(null);
      evt.preventDefault();
      return false;
    }
  }
});
