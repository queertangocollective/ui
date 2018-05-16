import Component from '@ember/component';
import { get } from '@ember/object';
import RSVP from 'rsvp';
import layout from './template';

export default Component.extend({
  layout,

  didReceiveAttrs() {
    RSVP.resolve(this.value).then((uploads) => {
      uploads = uploads || [];
      this._uploads = uploads.slice();
    });
  },

  actions: {
    add(upload) {
      let uploads = this._uploads;
      uploads.push(upload);
      this.onchange(uploads);
    },
    change(index, upload) {
      let uploads = this._uploads.slice();
      if (upload) {
        uploads.splice(index, 1, upload);
      } else {
        uploads.splice(index, 1);
      }
      this.onchange(uploads);
    }
  }
});
