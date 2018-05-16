import Component from '@ember/component';
import { get } from '@ember/object';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';

import copy from '../../system/copy';
import layout from './template';
import { wait } from '../../helpers/wait';

const ESCAPE = 27;

function oncopy(component) {
  let element = get(component, 'element');
  let input = element.querySelector('input');
  let { resolve, reject, promise } = RSVP.defer();
  document.addEventListener('mousedown', reject);
  input.addEventListener('copy', resolve);
  element.addEventListener('focusout', reject);

  return promise.finally(function () {
    document.removeEventListener('mousedown', reject);
    input.removeEventListener('copy', resolve);
    element.removeEventListener('focusout', reject);
  });
}

export default Component.extend({

  layout,

  classNames: ['copy-field'],

  osx: navigator.platform.match(/Mac/),

  selectText() {
    let input = this.element.querySelector('input');
    input.select();
  },

  copyText: task(function *(text) {
    try {
      yield copy(text);
      yield this.copied.perform();
      yield wait('600ms');
    } catch (e) {
      yield this.prompt.perform();
    }
  }).drop(),

  prompt: task(function *() {
    this.selectText();
    yield oncopy(this);
    yield this.copied.perform();
  }).drop(),

  copied: task(function *() {
    if (this.oncopy) {
      this.oncopy();
    }
    yield wait('750ms');
  }),

  focusIn() {
    if (this._mayClick) { return; }

    this.focused = true;

    this.prompt.perform().then(() => {
      return wait('750ms');
    }).then(() => {
      if (this.focused) {
        return this.focusIn();
      }
    }, function () {});
  },

  focusOut() {
    this.focused = false;
  },

  buttonDown() {
    // Without this, when a user clicks on the button,
    // it will become focused and trigger the prompt.
    this._mayClick = true;
    let unsetMayClick = () => {
      document.removeEventListener('mouseup', unsetMayClick);
      this._mayClick = false;
    }
    document.addEventListener('mouseup', unsetMayClick);
  },

  keyUp(evt) {
    switch (evt.which) {
    case ESCAPE:
      this.element.blur();
      window.getSelection().removeAllRanges();
      this.prompt.cancelAll();
    }
  },

  actions: {
    copy(evt) {
      evt.preventDefault();
      if (this._finishingAnimation) { return; }

      this.copyText.perform(this.value);
    }
  }
});
