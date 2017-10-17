import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

let id = 0;

export default Component.extend({
  photo: reads('payload.photo'),

  name: computed({
    get() {
      return `photo-card-editor-${id++}`;
    }
  })
});
