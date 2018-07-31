import Controller from '@ember/controller';
import { inject as method } from 'ember-service-methods';
import { inject as service } from '@ember/service';
import { computed, get, set } from '@ember/object';

export default Controller.extend({
  open: method(),
  flash: method(),
  intl: service(),

  queryParams: ['sort', 'as'],

  sort: 'name',

  locale: computed(function () {
    return this.intl.locale[0];
  }),

  locales: computed(function () {
    return [{
      name: 'English (USA)',
      code: 'en-us'
    }, {
      name: 'English (Germany)',
      code: 'en-de'
    }];
  }),

  currencies: computed(function () {
    return ['USD', 'EUR', 'CAD'];
  }),

  newCountries: computed(function () {
    return [{
      isDeleted: false,
      deleteRecord() {
        set(this, 'isDeleted', true);
      }
    }];
  }),

  countries: computed('sort', 'model', 'query', function () {
    let countries = get(this, 'model').filter((country) => {
      return country.name.indexOf(this.query || '') !== -1;
    });
    let sort = get(this, 'sort');
    if (sort[0] === '-') {
      return countries.sortBy(sort.slice(1)).reverse().slice(0, 20);
    }
    return countries.sortBy(get(this, 'sort')).slice(0, 20);
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

    logout() {},

    setLocale(locale) {
      this.intl.setLocale([locale.code, 'en']);
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
