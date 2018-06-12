import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  actions: {
    registerWith(parent, form) {
      form.set('parent', parent);
      parent.register(form);
    },
    deleteRecord(record, evt) {
      evt.preventDefault();
      record.deleteRecord();
    }
  }
}).reopenClass({
  positionalParams: ['fieldName']
});
