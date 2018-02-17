import { helper } from '@ember/component/helper';
import moment from 'moment';

function time(t) {
  if (t.format('mm') === '00') {
    return t.format('h');
  } else {
    return t.format('h:mm');
  }
}

function formatTime(s, e) {
  let startsAt = moment(s);
  let endsAt = moment(e);

  if (startsAt.format('A') === endsAt.format('A')) {
    return `${time(startsAt)} - ${time(endsAt)}${endsAt.format('a')}`;
  } else {
    return `${time(startsAt)}${startsAt.format('a')} - ${time(endsAt)}${endsAt.format('a')}`;
  }
}

export function formatDateRange(startDate, endDate) {
  if (moment(startDate).isSame(moment(endDate), 'day')) {
    return moment(startDate).format('MMMM D, YYYY') + ' ' + formatTime(startDate, endDate);
  } else if (moment(startDate).isSame(moment(endDate), 'month')) {
    return `${moment(startDate).format("MMMM D h:mma")} - ${moment(endDate).format('D, YYYY h:mma')}`;
  } else {
    return `${moment(startDate).format("MMMM D, YYYY h:mma")} - ${moment(endDate).format('MMMM D, YYYY h:mma')}`;
  }
}

export default helper(function ([startDate, endDate]) {
  return formatDateRange(startDate, endDate);
});
