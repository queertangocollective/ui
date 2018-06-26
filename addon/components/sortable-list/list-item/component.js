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

  displaySort: computed('sort', function () {
    return this.sort.split('.').map(dasherize).join('.');
  }),

  displaySortAsc: computed('sortAsc', function () {
    return this.sortAsc.split('.').map(dasherize).join('.');
  }),

  displaySortDesc: computed('sortDesc', function () {
    return this.sortDesc.split('.').map(dasherize).join('.');
  }),

  didRender() {
    if (!this.item) {
      if (this.displaySort === this.displaySortAsc) {
        this.list.set('currentSort', {
          name: this.sortAsc,
          direction: 'asc',
          reverse: this.displaySortDesc
        });
      } else if (this.displaySort === this.displaySortDesc) {
        this.list.set('currentSort', {
          name: this.sortAsc,
          direction: 'desc',
          reverse: this.displaySortAsc
        });
      }
    }
  }
}).reopenClass({
  positionalParams: ['sortAsc', 'sortDesc']
});
