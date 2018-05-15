import Component from '@ember/component';
import { set, get, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import layout from './template';
import RSVP from 'rsvp';
import opacity from 'ember-animated/motions/opacity';
import scale from 'ember-animated/motions/scale';
import move from 'ember-animated/motions/move';
import { easeInOut as easing } from 'ember-animated/easings/cosine';

/**
  `{{dialog-box}}`es are a modal dialog
  component. This component is used to both mount
  and render dialogs in apps.

  To mount the dialog, place the following code
  in your application template:

  ```htmlbars
  {{dialog-box}}
  ```

  This lets the dialog box know where to render
  boxes that are rendered in other routes.

  When a dialog should be displayed, render it by
  showing it in an if:

  ```htmlbars
  {{#if sorting}}
    {{#with (action (mut sorting) false) as |dismiss|}}
      {{dialog-box (component 'sorting-hat-dialog' onsort=(pipe (action (mut house)) dismiss))
                   ondismiss=dismiss}}
    {{/with}}
  {{/if}}
  ```

  This example has a few things worth noting.

  Dialogs do not dismiss automatically when an action
  is triggered. They must be dismissed after completing
  the action. This allows for the dialog to remain open
  while saving, etc. This can also be handled inside the
  component if you wish.

  `ondismiss` is a required action by `{{dialog-box}}`.
  This action should dismiss the dialog from the screen.

  Components created by the dialog box are given a hash
  with helpers provided by the dialog itself. These are:

  - `dismiss`

  @public
  @class DialogBox
  @extends Ember.Component
 */
export default Component.extend({
  tagName: '',
  layout,

  open: service(),

  /**
    `ondismiss` is triggered when the dialog is dismissed.
    The action taken by this handler should remove the
    `{{dialog-box}}` component from the page.

    @event ondismiss
   */
  ondismiss: null,

  duration: 200,

  /**
    `dialog-class` is a list of classes that will be added
    to the root of the dialog that's being rendered.

    @property dialog-class
    @default ''
    @type String
   */
  'dialog-class': '',

  didReceiveAttrs() {
    let send = {
      className: 'dialog-box',
      dismiss: get(this, 'ondismiss'),
      dialog: get(this, 'dialog'),
      group: get(this, 'group'),
      class: get(this, 'dialog-class')
    };

    if (get(this, 'send.dialog')) {
      delete send.dialog;
      setProperties(this, 'send', send);
    } else {
      set(this, 'send', send);
    }
  },

  fade: function* ({ insertedSprites, removedSprites }) {
    yield RSVP.all([
        ...insertedSprites.map(sprite => opacity(sprite, { from: 0, to: 1 })),
        ...removedSprites.map(sprite => opacity(sprite, { from: 1, to : 0 }))
    ]);

    if (insertedSprites.length) {
      document.body.classList.add('noscroll');
    } else {
      document.body.classList.remove('noscroll');
    }
  },

  show: function* ({ receivedSprites, sentSprites }) {
    yield RSVP.all([
        ...receivedSprites.map(sprite => {
          return RSVP.all([
            scale(sprite, { easing }),
            move(sprite, { easing }),
            opacity(sprite, { from: 0, to: 1, easing })
          ]);
        }),
        ...sentSprites.map(sprite => {
          return RSVP.all([
            scale(sprite, { easing }),
            move(sprite, { easing }),
            opacity(sprite, { from: 1, to: 0, easing })
          ]);
        })
    ]);
  }
}).reopenClass({
  positionalParams: ['dialog']
});

