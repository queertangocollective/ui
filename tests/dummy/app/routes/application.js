import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),

  beforeModel() {
    this.intl.addTranslations('en', {
      countries: {
        notFound: 'No Countries found for "{query}"',
        none: 'No Countries have been added yet',
        more: 'Load more',
        name: 'Name',
        code: 'Code',
        capital: 'Capital'
      },
      test: {
        text: 'text-field',
        editor: 'text-editor',
        select: 'select-field',
        multiline: 'text-area',
        number: 'number-field',
        percent: 'percent-field',
        amount: 'currency-field',
        autocomplete: 'auto-complete',
        password: 'password-field',
        url: 'url-field',
        date: 'date-field',
        datetime: 'datetime-field',
        checked: 'check-box',
        newCountries: {
          name: 'Country Name',
          code: 'Country Code'
        }
      }
    });
    this.intl.setLocale(['en-US', 'en']);
  },

  model() {
    return fetch('https://restcountries.eu/rest/v2/', {
      mode: 'cors'
    }).then((result) => {
      return result.json();
    });
  }
});
