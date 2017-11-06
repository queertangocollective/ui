import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import RSVP from 'rsvp';
import Changeset from 'ember-changeset';
import layout from './template';

export default Component.extend({
  layout,

  tagName: 'form',

  multiple: false,

  novalidate: true,

  attributeBindings: ['novalidate'],

  changeset: computed('model', {
    get() {
      return new Changeset(get(this, 'model') || {});
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
    let changes = get(this, 'changeset').snapshot().changes;
    let isDirty = changeset.get('isDirty') || model.get('isDeleted');

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
    },

    onsubmit() {
      return this.submit().then(() => {
        get(this, 'onsaved')(get(this, 'model'));
      });
    }
  }
}).reopenClass({
  positionalParams: ['model']
});
