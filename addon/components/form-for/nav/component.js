import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  tagName: '',

  hasChanges: computed('changeset.hasChanges', 'nestedForms.@each.changeset.hasChanges', function () {
    return this.changeset.hasChanges || this.nestedForms.someBy('changeset.hasChanges');
  }),

  stop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
});
