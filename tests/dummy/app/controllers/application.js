import Controller from '@ember/controller';
import method from 'ember-service-methods/inject';

export default Controller.extend({
  flash: method(),

  queryParams: ['sort'],

  orquestas: [{
    name: 'Canaro'
  }, {
    name: 'Di Sarli'
  }, {
    name: 'D\'Arienzo'
  }, {
    name: 'Piazzolla'
  }],

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
