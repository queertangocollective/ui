import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  tagName: '',
  layout,
  sortable: true,
  sortDesc: computed('sortAsc', function () {
    return `-${this.sortAsc}`;
  })
}).reopenClass({
  positionalParams: ['sortAsc', 'sortDesc']
});
