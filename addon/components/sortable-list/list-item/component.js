import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  sortable: true,
  sortDesc: computed('sortAsc', function () {
    return `-${this.sortAsc}`;
  }),
  didRender() {
    if (!this.item && this.element) {
      if (this.sort === this.sortAsc) {
        this.list.set('currentSort', {
          html: this.element.querySelector('span').innerHTML,
          direction: 'asc',
          reverse: this.sortDesc
        });
      } else if (this.sort === this.sortDesc) {
        this.list.set('currentSort', {
          html: this.element.querySelector('span').innerHTML,
          direction: 'desc',
          reverse: this.sortAsc
        });
      }
    }
  }
}).reopenClass({
  positionalParams: ['sortAsc', 'sortDesc']
});
