import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer, get } from '@ember/object';
import layout from './template';

export default Component.extend({

  layout,

  classNames: ['navigation-bar'],

  router: service(),

  init() {
    this._super();
    this.didTransition();
  },

  didTransition: observer('router.currentRouteName', function () {
    if (get(this, 'popover')) {
      get(this, 'popover').hide();
    }
  })
});
