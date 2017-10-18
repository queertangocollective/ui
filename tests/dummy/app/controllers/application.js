import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    async query({ text }) {
      let result = await fetch('https://restcountries.eu/rest/v2/name/' + text, {
        mode: 'cors'
      });
      return result.json();
    }
  }
});
