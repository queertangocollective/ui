import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { bind } from '@ember/runloop';
import { observer, get } from '@ember/object';
import $ from 'jquery';

export default Component.extend({

  flash: service(),

  session: service(),

  stick: observer('session.currentUser', function () {
    let top = Math.max($('.admin').height() - $(window).scrollTop(), 0) + 20;
    this.$('.snack-bar').css({ top });
  }),

  didInsertElement() {
    this._stick = bind(this, 'stick');
    $(window).on('scroll', this._stick);
    this.stick();
  },

  willDestroyElement() {
    $(window).off('scroll', this._stick);
  },

  actions: {
    throw() {
      get(this, 'flash.message.reject')();
    }
  }
});
