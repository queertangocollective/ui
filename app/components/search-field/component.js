import { isBlank } from '@ember/utils';
import Component from '@ember/component';
import { set, get } from '@ember/object';
import { cancel, debounce } from '@ember/runloop';
import layout from './template';

/**
  A `{{search-field}}` is a drop in replacement
  for `<input type="search">`.

  The simplest `{{search-field}}` would be:

  ```htmlbars
  {{search-field query=q onquery=(action (mut q))}}
  ```

  @public
  @class SearchField
  @extends Ember.Component
 */
export default Component.extend({
  layout,
  classNames: ['search-field'],
  classNameBindings: ['hasIcon'],

  /**
    Whether the search icon should be displayed

    @property hasIcon
    @type Boolean
    @default true
  */
  hasIcon: true,

  /**
    Called whenever the user changes the value.

    @event onquery
    @param {String} value The string
   */

  /**
    The `name` property of the `input` element.

    @property name
    @type String
    @default null
   */
  name: null,

  /**
    Whether or not the field is disabled.

    @property disabled
    @type Boolean
    @default false
   */
  disabled: false,

  didReceiveAttrs() {
    if (this._timer == null) {
      set(this, 'value', get(this, 'query'));
    }
  },

  clear() {
    set(this, 'value', null);
    cancel(this._timer);
    this._timer = null;
    get(this, 'onquery')('');
    if (get(this, 'onchange')) {
      get(this, 'onchange')('');
    }
  },

  search() {
    this._timer = null;
    get(this, 'onquery')(get(this, 'value'));
  },

  actions: {
    change(value) {
      if (isBlank(value) || value == null) {
        this.clear();
      } else if (value !== get(this, 'value')) {
        set(this, 'value', value);
        this._timer = debounce(this, 'search', 500);
      }
      if (get(this, 'onchange')) {
        get(this, 'onchange')(value);
      }
    }
  }
});
