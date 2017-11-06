import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  actions: {
    registerWith(parent, form) {
      parent.register(form);
    }
  }
}).reopenClass({
  positionalParams: ['fieldName']
});
