import Controller from '@ember/controller';
import method from 'ember-service-methods/inject';
import { set } from '@ember/object';

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

    upload(key, files) {
      (Array.isArray(files) ? files : [files]).without(undefined).forEach(function (file) {
        file.readAsDataURL().then((url) => {
          set(file, 'url', url);
        })
      });
      console.log(key, files);
      set(this, key, files);
    },

    flash(text) {
      return this.flash(text, {
        timeout: 5000
      });
    }
  }
});
