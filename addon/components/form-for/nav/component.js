import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: '',

  stop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
});
