import Component from '@ember/component';
import { capitalize, dasherize } from '@ember/string';
import { get, computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import layout from './template';

export default Component.extend({
  layout,

  classNames: ['form-for_field'],

  classNameBindings: ['autocomplete:has-autocompletion'],

  min: Number.MIN_SAFE_INTEGER,

  max: Number.MAX_SAFE_INTEGER,

  inputId: computed('fieldName', 'model', 'index', {
    get() {
      return [
        get(this, 'modelName'),
        get(this, 'index'),
        dasherize(get(this, 'fieldName') || '')
      ].compact().join('_');
    }
  }),

  modelName: computed('model', {
    get() {
      return get(this, 'model._content.constructor.modelName');
    }
  }),

  label: computed('fieldName', {
    get() {
      return dasherize(get(this, 'fieldName') || '').split('-').map(capitalize).join(' ');
    }
  }),

  actions: {
    query(...args) {
      return tryInvoke(this, 'onquery', args);
    },

    autocomplete(model, key, value, evt) {
      get(this, 'onchange')(model, key, value);
      evt.preventDefault();
      return false;
    }
  }
}).reopenClass({
  positionalParams: ['fieldName']
});
