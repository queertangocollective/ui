import Controller from '@ember/controller';
import method from 'ember-service-methods/inject';

export default Controller.extend({
  flash: method(),
  actions: {
    async query({ text }) {
      let result = await fetch('https://restcountries.eu/rest/v2/name/' + text, {
        mode: 'cors'
      });
      return result.json();
    },

    flash() {
      this.flash('Hello', {
        timeout: 5000
      });
    }
  }
});
