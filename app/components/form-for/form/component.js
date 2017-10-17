import Component from '@ember/component';

export default Component.extend({
  actions: {
    registerWith(parent, form) {
      parent.register(form);
    }
  }
}).reopenClass({
  positionalParams: ['fieldName']
});
