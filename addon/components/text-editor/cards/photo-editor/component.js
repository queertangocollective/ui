import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  
  submit(payload, changes) {
    payload = Object.assign({}, payload);
    Object.assign(payload, changes);
    this.saveCard(payload);
  }
});
