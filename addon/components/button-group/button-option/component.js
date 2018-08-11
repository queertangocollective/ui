import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'button',
  classNameBindings: ['active'],

  active: computed('option', 'value', function () {
    return this.option === this.value;
  }),

  click() {
    this.onchange(this.option);
    return false;
  }
}).reopenClass({
  positionalParams: ['option']
});
