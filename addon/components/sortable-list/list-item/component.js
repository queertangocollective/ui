import Component from '@ember/component';
import { computed } from '@ember/object';
import { dasherize } from '@ember/string';
import layout from './template';

export default Component.extend({
  layout,
  sortable: true,
  sortDesc: computed('sortAsc', function () {
    return `-${this.sortAsc}`;
  }),
  didRender() {
    if (!this.item && this.element) {
      if (this.sort === dasherize(this.sortAsc)) {
        this.list.set('currentSort', {
          html: this.element.querySelector('a').innerHTML,
          direction: 'asc',
          reverse: this.sortDesc
        });
      } else if (this.sort === dasherize(this.sortDesc)) {
        this.list.set('currentSort', {
          html: this.element.querySelector('a').innerHTML,
          direction: 'desc',
          reverse: this.sortAsc
        });
      }
    }
  }
}).reopenClass({
  positionalParams: ['sortAsc', 'sortDesc']
});
