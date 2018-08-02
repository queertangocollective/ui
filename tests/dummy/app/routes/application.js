import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),

  beforeModel() {
    this.intl.addTranslations('en', {
      navigation: {
        home: 'Home',
        apple: 'Apple',
        banana: 'Banana',
        coconut: 'Coconut',
        durian: 'Durian',
        elderberry: 'Elderberry',
        fig: 'Fig',
        grape: 'Grape',
        honeydew: 'Honeydew',
        more: 'More',
        logout: 'Logout'
      },
      textEditor: {
        strong: 'Bold [{shortcut}]',
        em: 'Italic [{shortcut}]',
        u: 'Underline [{shortcut}]',
        a: 'Link',
        textSize: 'Text Size',
        embed: 'Add Embed',
        h2: 'Extra Large',
        h3: 'Large',
        none: 'Normal',
        blockquote: 'Quote',
        small: 'Small'
      },
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
        },
        actions: {
          snackbar: 'Show Snackbar',
          showDialog: 'Show Dialog',
          workflow: 'Show Workflow',
          delete: 'Confirm',
          confirmDelete: 'Are you sure?'
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
