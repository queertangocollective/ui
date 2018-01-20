import Component from '@ember/component';
import { set, get } from '@ember/object';
import { debounce } from '@ember/runloop';
import RSVP from 'rsvp';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['upload-field'],

  multiple: false,

  files: null,

  didReceiveAttrs() {
    RSVP.resolve(get(this, 'value')).then((files) => {
      files = files || [];
      if (!Array.isArray(files)) {
        files = [files];
      }
      set(this, 'files', files.slice());
    });
  },

  update(files) {
    if (get(this, 'multiple')) {
      get(this, 'onchange')(files);
    } else {
      get(this, 'onchange')(files[0]);
    }
  },

  actions: {
    add(file) {
      let files = get(this, 'files');
      files.push(file);
      debounce(this, 'update', files, 10);
    },

    change(index, file) {
      let files = get(this, 'files');
      if (file) {
        files.splice(index, 1, file);
      } else {
        files.splice(index, 1);
      }
      this.update(files);
    }
  }
});
