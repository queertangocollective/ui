import Autoresize from '../../mixins/autoresize';
import Component from '@ember/component';
import { set, get } from '@ember/object';
import { tryInvoke, isBlank } from '@ember/utils';
import { later } from '@ember/runloop';
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
    @default 'M/D/YYYY h:mma'
   */
  format: 'M/D/YYYY h:mma',

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
    if (get(this, 'isFocused')) {
      let input = get(this, 'element').querySelector('input');
      return input.value;
    } else {
      let value = get(this, 'value');
      return value ? moment(value).format(get(this, 'format')) : '';
    }
  },

  _setValue(value) {
    let date = moment.tz(value, get(this, 'format'), get(this, 'timezone'));
    if (isBlank(value) || value == null) {
      get(this, 'onchange')(null);
    } else if (date.isValid()) {
      set(this, 'center', date);
      get(this, 'onchange')(date.toDate());
    }
    this._updateDisplayValue(value);
  },

  _updateDisplayValue(displayValue) {
    let input = get(this, 'element').querySelector('input');
    let selectionStart = input.selectionStart;
    let selectionEnd = input.selectionEnd;

    set(this, 'displayValue', displayValue || '');
    input.value = displayValue || '';
    if (get(this, 'isFocused')) {
      input.selectionStart = selectionStart;
      input.selectionEnd = selectionEnd;
    }
  },

  actions: {
    handleArrowKeys(evt) {
      if (evt.which === UP || evt.which === DOWN) {
        let input = get(this, 'element').querySelector('input');
        let cursor = input.selectionStart;

        let direction = evt.which === UP ? 1 : -1;
        let date = moment(get(this, 'value'));
        let format = get(this, 'format');
        let formattedDate = date.format(format);
        let separators = formattedDate.replace(/\d+/g, '0').split('0');
        let parts = [];

        let numberStart = 0;
        let formatStart = 0;
        separators.forEach(function (separator) {
          if (separator !== '') {
            let formatEnd = format.indexOf(separator, formatStart);
            let numberEnd = formattedDate.indexOf(separator, numberStart);
            let meridian = '';

            if (formatEnd === -1) {
              formatEnd = format.indexOf('a', formatStart);
            }
            if (formatEnd === -1) {
              formatEnd = format.indexOf('A', formatStart);
            }

            if (format.slice(formatEnd) === 'a' || format.slice(formatEnd) === 'A') {
              meridian = separator;
              separator = '';
            }

            parts.push({
              start: numberStart,
              end: numberEnd + separator.length,
              format: format.slice(formatStart, formatEnd),
              value: formattedDate.slice(numberStart, numberEnd)
            });
            formatStart = formatEnd + separator.length;
            numberStart = numberEnd + separator.length;

            if (meridian) {
              parts.push({
                start: numberStart,
                end: numberStart + meridian.length,
                format: format.slice(formatStart, formatStart + 1),
                value: meridian
              });
              numberStart = numberStart + meridian.length;
              formatStart = formatStart + 1;
            }

          } else if (numberStart !== 0) {
            parts.push({
              start: numberStart,
              end: formattedDate.length + 1,
              format: format.slice(formatStart),
              value: formattedDate.slice(numberStart)
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
        } else if (unit.format.match(/h+|k+/i)) {
          date.add(direction, 'hour');
        } else if (unit.format === 'mm') {
          date.add(direction, 'minute');
        } else if (unit.format === 'a' || unit.format === 'A') {
          if (date.hour() < 12) {
            date.add(12, 'hours');
          } else {
            date.subtract(12, 'hours');
          }
        }

        this._setValue(date.format(get(this, 'format')));
        return false;
      }
    },

    restrict(evt) {
      if (evt.shiftKey && evt.which !== 58) {
        return false;
      }

      if (evt.which <= 40) {
        return true;
      }

      return /[:\d\w/apm]/.test(String.fromCharCode(evt.which));
    },

    reformat() {
      let input = get(this, 'element').querySelector('input');
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

    onchange({ moment }) {
      set(this, 'isActive', false);
      this._setValue(moment.format('MM/DD/YYYY h:mma'));
    }
  }
});
