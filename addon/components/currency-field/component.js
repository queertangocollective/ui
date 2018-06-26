import NumberField from '../number-field/component';
import layout from './template';
import { computed } from '@ember/object';

export default NumberField.extend({
  layout,

  classNames: ['currency-field'],

  style: 'currency',

  precision: null,

  hasCurrencySelector: false,

  step: computed('multiplier', function () {
    return this.multiplier;
  }),

  multiplier: computed('maximumFractionDigits', function () {
    return Math.pow(10, this.maximumFractionDigits);
  }),

  _format(number) {
    if (isNaN(number) || number == null) {
      return number || '';
    }
    let result = this.formatter.format(number / this.multiplier);
    if (this.hasCurrencySelector) {
      return result.replace(this.symbol, '').trim();
    }
    return result;
  },
});
