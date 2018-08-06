import Component from '@ember/component';
import layout from './template';
import { set, get, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { later } from '@ember/runloop';

export default Component.extend({
  tagName: '',
  layout,

  didReceiveAttrs() {
    if (get(this, 'progress') > 0 &&
        get(this, 'value') === 0) {
      later(() => {
        if (this.isDestroyed) { return; }
        set(this, 'progress', 0);
      }, 1000);
    } else {
      set(this, 'progress', get(this, 'value'));
    }
  },

  style: computed('progress', function () {
    return htmlSafe(`width: ${get(this, 'progress')}%`);
  })
});

