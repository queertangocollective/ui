import Controller from '@ember/controller';
import method from 'ember-service-methods/inject';
import { computed, get, set } from '@ember/object';

export default Controller.extend({
  open: method(),
  flash: method(),

  queryParams: ['sort', 'as'],

  sort: 'name',

  newCountries: computed(function () {
    return [{
      isDeleted: false,
      deleteRecord() {
        set(this, 'isDeleted', true);
      }
    }];
  }),

  countries: computed('sort', 'model', function () {
    let sort = get(this, 'sort');
    if (sort[0] === '-') {
      return get(this, 'model').sortBy(sort.slice(1)).reverse().slice(0, 20);
    }
    return get(this, 'model').sortBy(get(this, 'sort')).slice(0, 20);
  }),

  actions: {
    addCountry(evt) {
      evt.preventDefault();
      this.newCountries.pushObject({
        isDeleted: false,
        deleteRecord() {
          set(this, 'isDeleted', true);
        }
      });
    },

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
      set(this, key, files);
    },

    flash(text) {
      return this.flash(text, {
        timeout: 5000
      });
    },

    open(dialog) {
      return this.open(dialog).then((answer) => {
        return answer;
      }, function () {});
    }
  }
});
