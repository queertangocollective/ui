import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import layout from './template';

export default Component.extend({

  layout,

  classNames: ['sortable-list'],

  icon: 'sad',

  hasMore: computed('total', 'model.length', {
    get() {
      return get(this, 'total') > get(this, 'model.length');
    }
  }),

  actions: {
    loadMore(offset) {
      return get(this, 'load')(offset).then(({ model, meta }) => {
        set(this, 'rows', [...get(this, 'rows').toArray(), ...model.toArray()]);
        set(this, 'total', meta.page.total);
      });
    }
  }
});
