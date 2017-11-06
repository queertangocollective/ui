import Component from '@ember/component';
import layout from './layout';

export default Component.extend({
  layout,
  tagName: ''
}).reopenClass({
  positionalParams: ['text']
});
