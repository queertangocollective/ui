import SubmitButton from '../submit-button/component';
import layout from './template';
import { get, set } from '@ember/object';

export default SubmitButton.extend({

  layout,

  classNameBindings: ['isConfirming'],

  classNames: ['confirm-button'],

  click(evt) {
    evt.preventDefault();
    if (get(this, 'isProcessing')) return false;

    if (get(this, 'isConfirming')) {
      document.removeEventListener('click', this.dismiss);
      set(this, 'isConfirming', false);
      get(this, 'submit').perform(get(this, 'onsubmit'));
    } else {
      set(this, 'isConfirming', true);
      this.dismiss = () => {
        set(this, 'isConfirming', false);
      };
      document.addEventListener('click', this.dismiss);
    }
    return false;
  },

  willDestroyElement() {
    if (this.dismiss) {
      document.removeEventListener('click', this.dismiss);
    }
  }
});
