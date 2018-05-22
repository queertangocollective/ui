import SubmitButton from '../submit-button/component';
import layout from './template';
import { set } from '@ember/object';

export default SubmitButton.extend({

  layout,

  classNameBindings: ['isConfirming'],

  classNames: ['confirm-button'],

  click(evt) {
    evt.preventDefault();
    if (this.isProcessing) return false;

    if (this.isConfirming) {
      document.removeEventListener('click', this.dismiss);
      set(this, 'isConfirming', false);
      this.submit.perform(this.onsubmit);
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
