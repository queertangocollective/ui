import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  sort: 'name',

  countries: computed('sort', 'model', function () {
    let sort = this.sort;
    if (sort[0] === '-') {
      return this.model.sortBy(sort.slice(1)).reverse().slice(0, 20);
    }
    return this.model.sortBy(sort).slice(0, 20);
  })
});