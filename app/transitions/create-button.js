import Ember from 'ember';
import { all } from 'rsvp';
import { animate } from "liquid-fire";

export default function createButton() {
  let duration = Ember.testing ? 0 : 200;
  let easing = 'ease-in-out';

  let oldButton = this.oldElement.find('button');
  let oldField = this.oldElement.find('.text-field');

  let newButton = this.newElement.find('button');
  let newField = this.newElement.find('.text-field');

  let animations = {
    newField: {},
    oldField: {},
    oldButton: { opacity: [0, 1] },
    newButton: { opacity: [1, 0] }
  };
  if (newField.length) {
    animations.newField.width = [newField.outerWidth(), oldButton.outerWidth()];
    animations.oldButton.width = [newField.outerWidth(), oldButton.outerWidth()];
  }
  if (oldField.length) {
    animations.oldField.width = [newButton.outerWidth(), oldField.outerWidth()];
  }

  return all([
    animate(newField, animations.newField, { duration, easing }),
    animate(oldField, animations.oldField, { duration, easing }),
    animate(oldButton, animations.oldButton, { duration, easing }),
    animate(newButton, animations.newButton, { duration, easing })
  ]);
}
