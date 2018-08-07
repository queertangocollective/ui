import Component from '@ember/component';
import layout from './template';
import { set, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { later } from '@ember/runloop';

export default Component.extend({
  tagName: '',
  layout,

  didReceiveAttrs() {
    if (this.progress > 0 && this.value === 0) {
      later(() => {
        if (this.isDestroyed) { return; }
        set(this, 'progress', 0);
      }, 1000);
    } else {
      set(this, 'progress', this.value);
    }
  },

  style: computed('progress', function () {
    return htmlSafe(`width: ${this.progress}%`);
  })
});

