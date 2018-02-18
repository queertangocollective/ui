import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['tabular-list']
});
