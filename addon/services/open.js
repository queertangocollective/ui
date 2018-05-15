import Service from '@ember/service';
import { set, get } from '@ember/object';

/**
  Example:

  ```js
  export default Ember.Route.extend({
    open: method(),

    actions: {
      findPerson(dialog) {
        return this.open(dialog).then((person) => {
          return person;
        });
      }
    })
  });
  ```
*/
export default Service.extend({
  ondismiss: null,
  dialog: null,

  execute(dialog) {
    return new Promise((resolve, reject) => {
      set(this, 'ondismiss', reject);
      set(this, 'dialog', Object.assign({
        onsubmit: resolve
      }, dialog));
    }).finally(() => {
      set(this, 'dialog', null);
      set(this, 'ondismiss', null);
    });
  }
});
