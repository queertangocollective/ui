import { helper } from '@ember/component/helper';
import moment from 'moment';

export function formatDateRange(startDate, endDate) {
  if (moment(startDate).isSame(moment(endDate), 'day')) {
    return moment(startDate).format('MMMM D, YYYY h:MMa') + ' &endash; ' + moment(endDate).format('h:MMa');
  } else if (moment(startDate).isSame(moment(endDate), 'month')) {
    return `${moment(startDate).format("MMMM D h:MMa")} &endash; ${moment(endDate).format('D, YYYY h:MMa')}`;
  } else {
    return `${moment(startDate).format("MMMM D, YYYY h:MMa")} &endash; ${moment(endDate).format('MMMM D, YYYY h:MMa')}`;
  }
}

export default helper(function ([startDate, endDate]) {
  return formatDateRange(startDate, endDate);
});
