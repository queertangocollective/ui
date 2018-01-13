import Controller from '@ember/controller';
import method from 'ember-service-methods/inject';

export default Controller.extend({
  flash: method(),

  queryParams: ['sort'],

  actions: {
    async query({ text }) {
      let result = await fetch('https://restcountries.eu/rest/v2/name/' + text, {
        mode: 'cors'
      });
      return result.json();
    },

    flash(text) {
      return this.flash(text, {
        timeout: 5000
      });
    }
  }
});
