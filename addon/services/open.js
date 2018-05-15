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

  execute(Dialog) {
    return new Promise((resolve, reject) => {
      set(this, 'ondismiss', reject);
      Dialog.ComponentClass = Dialog.ComponentClass.extend({
        onsubmit: resolve
      });
      set(this, 'dialog', Dialog);
    }).finally(() => {
      set(this, 'dialog', null);
      set(this, 'ondismiss', null);
    });
  }
});
