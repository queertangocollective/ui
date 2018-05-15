import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  setCaption(caption) {
    let payload = Object.assign({}, this.get('payload'));
    payload.caption = caption;
    this.saveCard(payload, false);
  }
});
