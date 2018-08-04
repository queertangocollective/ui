import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  tagName: '',
  layout,

  didReceiveAttrs() {
    this.set('name', file.name);
    this.file.readAsDataURL().then((url) => {
      this.set('url', url);
    });
  }
});
