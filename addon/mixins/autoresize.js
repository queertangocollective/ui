import Autoresize from 'ember-autoresize/mixins/autoresize';
import { get, set, computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { isNone } from '@ember/utils';
import { once } from '@ember/runloop';

export default Mixin.create(Autoresize, {
  autoresize: false,

  shouldResizeWidth: true,

  significantWhitespace: true,

  autoresizeElement: computed({
    set(_, value) {
      return value;
    }
  }),

  autoResizeText: computed('displayValue', 'value', 'placeholder', {
    get() {
      var value = get(this, 'displayValue') || get(this, 'value') || get(this, 'placeholder');
      if (isNone(value)) {
        value = '@';
      }
      return value;
    }
  }),

  didRender() {
    if (get(this, 'autoresize')) {
      once(this, 'measureSize');
    } else {
      get(this, 'autoresizeElement').removeAttribute('style');
    }
    set(this, 'autoresizeElement', this.element.querySelector('input'));
    this._updateDisplayValue(this._getValue());
  }
});
