import { get } from '@ember/object';
import NumberField from '../number-field/component';
import { l } from '../../helpers/l';

export default NumberField.extend({
  classNames: ['currency-field'],

  precision: 2,

  _format(number) {
    let precision = this.precision;
    if (number != null) {
      number *= 100;
    }

    return l('currency', number, {
      precision,
      'strip-insignificant-zeros': true
    }) || '';
  },

  _getValue() {
    let value = this.value;
    if (value != null) {
      return this.value / 100;
    }
  },

  _setValue(value) {
    if (value != null) {
      this.onchange(parseFloat((value * 100).toFixed(this.precision - 2), 10));
    } else {
      this.onchange(value);
    }
    this._updateDisplayValue(value);
  },

  _stepValue(step) {
    this._setValue(this._clamp((this._getValue() || 0) + step));
  },

  _trimDecimals(oldString, newString, precision) {
    let trimmedString = newString;

    if (trimmedString.indexOf('.') === -1 &&
        oldString.indexOf('.') !== -1) {
      trimmedString = '$' + trimmedString.replace(/\$/g, '') + '.' + oldString.slice(
        oldString.indexOf('.'),
        oldString.indexOf('.') + precision + 1
      ).replace(/\./g, '');
    }

    return trimmedString;
  },

  _moveCursor(previousCursorPosition, previousValue, newValue) {
    if (!this.isFocused) {
      return;
    }

    let input = this.element.querySelector('input');

    if (parseFloat(previousValue, 10) > this.max) {
      input.selectionStart = input.selectionEnd = newValue.length + 1;
    } else if (previousCursorPosition !== null &&
        previousCursorPosition === previousValue.length) {
      input.selectionStart = newValue.length + 1;
      input.selectionEnd = newValue.length + 1;
    } else {
      this._super(previousCursorPosition, previousValue, newValue);
    }
  }
});
