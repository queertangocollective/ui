import Service from '@ember/service';
import { set } from '@ember/object';
import { ConstReference } from '@glimmer/reference';

class UnboundReference extends ConstReference {
  static create(value){
    return new UnboundReference(value);
  }

  get(key) {
    return new UnboundReference(this.inner[key]);
  }
}

function addNamedArgument(args, key, value) {
  let reference = new UnboundReference(value);
  args.named[key] = reference;
  args.named.map[key] = reference;
  args.named.names = args.named.names.slice().concat(key);
  args.named.references = args.named.references.slice().concat(reference);
  args.length++;
  args.named.length++;
}

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
      addNamedArgument(Dialog.args, 'onsubmit', resolve);
      set(this, 'dialog', Dialog);
    }).finally(() => {
      set(this, 'dialog', null);
      set(this, 'ondismiss', null);
    });
  }
});
