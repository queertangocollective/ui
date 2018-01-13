import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return fetch('https://restcountries.eu/rest/v2/', {
      mode: 'cors'
    }).then((result) => {
      return result.json();
    });
  }
});
