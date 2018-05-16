import Component from '@ember/component';
import { get, computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  tagName: '',
  layout,
  sortDesc: computed('sortAsc', function () {
    return `-${this.sortAsc}`;
  })
}).reopenClass({
  positionalParams: ['sortAsc', 'sortDesc']
});
