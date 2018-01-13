import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['emoji-form'],

  emojis: computed(function () {
    return [
      '😀',
      '😃',
      '😄'
    ];
  })
});
