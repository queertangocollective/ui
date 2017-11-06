import Component from '@ember/component';
import { get } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  tagName: '',
  disabled: false,
  click(evt) {
    evt.preventDefault();
    if (!get(this, 'disabled')) {
      get(this, 'action')();
    }
    return false;
  }
}).reopenClass({
  positionalParams: ['action']
});
