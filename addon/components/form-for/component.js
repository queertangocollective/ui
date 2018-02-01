import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { debounce } from '@ember/runloop';
import RSVP from 'rsvp';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import layout from './template';

export default Component.extend({
  layout,

  tagName: 'form',

  multiple: false,

  novalidate: true,

  attributeBindings: ['novalidate'],

  changeset: computed('model', {
    get() {
      return BufferedProxy.create({
        content: get(this, 'model') || {}
      });
    }
  }),

  submit(evt) {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    let promises = [];
    let model = get(this, 'model');
    let changeset = get(this, 'changeset');
    let changes = get(this, 'changeset.buffer');
    let isDirty = changeset.get('hasChanges') || model.get('isDeleted');

    if (isDirty && (model == null || get(model, 'isNew'))) {
      return get(this, 'onsubmit')(model, changes).then(() => {
        return RSVP.all(get(this, 'nestedForms').map(function (form) {
          return form.submit(evt);
        }));
      });
    } else {
      promises = get(this, 'nestedForms').map(function (form) {
        return form.submit(evt);
      });
      if (isDirty) {
        promises.push(get(this, 'onsubmit')(model, changes));
      }
    }

    return RSVP.all(promises);
  },

  save() {
    return this.submit().then(() => {
      get(this, 'onsaved')(get(this, 'model'));
    });
  },

  init() {
    this._super(...arguments);
    set(this, 'nestedForms', []);
    tryInvoke(this, 'oninit', [this]);
  },

  register(form) {
    get(this, 'nestedForms').push(form);
  },

  actions: {
    onchange(model, field, value) {
      let [fieldName, ...path] = field.split('.');
      if (path.length) {
        let copy = Object.assign({}, get(model, fieldName));
        set(copy, path.join('.'), value);
        model.set(fieldName, copy);
      } else {
        model.set(field, value);
      }

      if (get(this, 'autosave')) {
        debounce(this, 'save', 2000);
      }
    }
  }
}).reopenClass({
  positionalParams: ['model']
});
