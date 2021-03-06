import Autoresize from '../../mixins/autoresize';
import Component from '@ember/component';
import { set } from '@ember/object';
import { tryInvoke, isBlank } from '@ember/utils';
import moment from 'moment';
import layout from './template';

const UP = 38;
const DOWN = 40;

export default Component.extend(Autoresize, {
  layout,
  classNames: ['date-field'],

  /**
    Called whenever the user changes the value.

    @event onchange
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
    The `format` that the date should be displayed in.

    @property format
    @type String
    @default 'M/D/YYYY'
   */
  format: 'M/D/YYYY',

  /**
    The `timezone` that the date should be displayed in.

    @property timezone
    @type String
    @default 'America/New_York'
   */
  timezone: 'America/New_York',

  /**
    Whether or not the field is disabled.

    @property disabled
    @type Boolean
    @default false
   */
  disabled: false,

  _getValue() {
    if (this.isFocused) {
      let input = this.element.querySelector('input');
      return input.value;
    } else {
      let value = this.value;
      return value ? moment(value).format(this.format) : '';
    }
  },

  _setValue(value) {
    let date = moment.tz(value, this.format, this.timezone);
    if (isBlank(value) || value == null) {
      this.onchange(null);
    } else if (date.isValid()) {
      set(this, 'center', date);
      this.onchange(date.toDate());
    }
    this._updateDisplayValue(value);
  },

  _updateDisplayValue(displayValue) {
    let input = this.element.querySelector('input');
    if (input.type === 'date') {
      if (this.value) {
        let date = moment.tz(this.value, this.timezone);
        input.value = date.format('YYYY-MM-DD');
      } else {
        input.value = null;
      }
      return;
    }
    let selectionStart = input.selectionStart;
    let selectionEnd = input.selectionEnd;

    set(this, 'displayValue', displayValue || '');
    input.value = displayValue || '';
    if (this.isFocused) {
      input.selectionStart = selectionStart;
      input.selectionEnd = selectionEnd;
    }
  },

  actions: {
    handleArrowKeys(evt) {
      if (evt.which === UP || evt.which === DOWN) {
        let input = this.element.querySelector('input');
        let cursor = input.selectionStart;

        let direction = evt.which === UP ? 1 : -1;
        let date = moment(this.value);
        let format = this.format;
        let formattedDate = date.format(format);
        let separators = formattedDate.replace(/\d+|(am)|(pm)/g, '0').split('0');
        let parts = [];

        let numberStart = 0;
        let formatStart = 0;
        separators.forEach(function (separator) {
          if (separator !== '') {
            let formatEnd = format.indexOf(separator, formatStart);
            let numberEnd = formattedDate.indexOf(separator, numberStart);

            parts.push({
              start: numberStart,
              end: numberEnd + separator.length,
              format: format.slice(formatStart, formatEnd),
              value: formattedDate.slice(numberStart, numberEnd)
            });
            formatStart = formatEnd + separator.length;
            numberStart = numberEnd + separator.length;
          } else if (numberStart !== 0) {
            parts.push({
              start: numberStart,
              end: formattedDate.length,
              format: format.slice(formatStart),
              value: format.slice(numberStart)
            });
          }
        });

        // Adjust the last item
        parts[parts.length - 1].end++;

        let unit = parts.find(function (part) {
          return cursor >= part.start && cursor < part.end;
        });

        if (unit.format === 'YYYY') {
          date.add(direction, 'year');
        } else if (unit.format === 'M' || unit.fomrat === 'MM') {
          date.add(direction, 'month');
        } else if (unit.format === 'D' || unit.format === 'DD') {
          date.add(direction, 'day');
        }

        this._setValue(date.format(this.format));
        return false;
      }
    },

    restrict(evt) {
      if (evt.which === 32) {
        return false;
      }

      if (evt.which <= 40 || evt.metaKey) {
        return true;
      }

      return /[\d/]/.test(String.fromCharCode(evt.which));
    },

    reformat() {
      let input = this.element.querySelector('input');
      this._setValue(input.value);
    },

    focus() {
      set(this, 'isFocused', true);
    },

    blur() {
      set(this, 'isFocused', false);
      tryInvoke(this, 'onblur');
    },

    updateCenter({ date }) {
      set(this, 'center', date);
      set(this, 'isFocused', true);
    },

    selectDate(evt) {
      // Ugh, adjust for timezone
      let date = moment.tz(evt.target.value, this.timezone);
      this.onchange(date.toDate());
    },

    onchange({ moment }) {
      set(this, 'isActive', false);
      this._setValue(moment.format(this.format));
    }
  }
});
