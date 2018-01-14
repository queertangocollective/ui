import Component from '@ember/component';
import { get } from '@ember/object';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';

import copy from '../../system/copy';
import layout from './template';
import { wait } from '../../helpers/wait';
import { getLayout } from 'dom-ruler';

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
    let input = get(this, 'element').querySelector('input');
    let selection = window.getSelection();
    let range = document.createRange();

    selection.removeAllRanges();
    input.select();
  },

  copyText: task(function *(text) {
    try {
      yield copy(text);
      yield get(this, 'copied').perform();
      yield wait('600ms');
    } catch (e) {
      yield get(this, 'prompt').perform();
    }
  }).drop(),

  prompt: task(function *() {
    this.selectText();
    yield oncopy(this);
    yield get(this, 'copied').perform();
  }).drop(),

  copied: task(function *() {
    if (get(this, 'oncopy')) {
      get(this, 'oncopy')();
    }
    yield wait('750ms');
  }),

  focusIn() {
    debugger;
    if (this._mayClick) { return; }

    this.focused = true;

    get(this, 'prompt').perform().then(() => {
      return wait('750ms');
    }).then(() => {
      if (this.focused) {
        return this.focusIn();
      }
    }, function (e) {});
  },

  focusOut() {
    this.focused = false;
  },

  buttonDown() {
    // Without this, when a user clicks on the button,
    // it will become focused and trigger the prompt.
    this._mayClick = true;
    let unsetMayClick = () => {
      $(document).off('mouseup', unsetMayClick);
      this._mayClick = false;
    }
    $(document).on('mouseup', unsetMayClick);
  },

  keyUp(evt) {
    switch (evt.which) {
    case ESCAPE:
      get(this, 'element').blur();
      window.getSelection().removeAllRanges();
      get(this, 'prompt').cancelAll();
    }
  },

  actions: {
    copy(evt) {
      evt.preventDefault();
      if (this._finishingAnimation) { return; }

      get(this, 'copyText').perform(get(this, 'value'));
    }
  }
});
