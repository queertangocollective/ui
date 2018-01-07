import SubmitButton from '../submit-button/component';
import layout from './template';

export default SubmitButton.extend({

  layout,

  classNameBindings: ['isConfirming'],

  click(evt) {
    evt.preventDefault();
    if (get(this, 'isConfirming')) {
      get(this, 'submit').perform(get(this, 'onsubmit')).then(() => {
        set(this, 'isConfirming', false);
      });
    } else {
      set(this, 'isConfirming', true);
    }
    return false;
  }
});
