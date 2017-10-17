import Component from '@ember/component';
import { get, computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  tagName: 'li',

  attributeBindings: ['style'],

  style: computed('event.startsAt', 'event.endsAt', {
    get () {
      let duration = moment.duration(moment(get(this, 'event.endsAt')).diff(moment(get(this, 'event.startsAt')))).asMinutes();
      let startsAt = moment.duration(moment(get(this, 'event.startsAt')).diff(moment(get(this, 'event.startsAt')).startOf('day'))).asMinutes();
      let height = duration - 1;
      let top = startsAt;

      return `top: ${top}px; height: ${height}px`;
    }
  })
});
