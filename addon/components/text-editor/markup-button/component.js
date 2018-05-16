import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import layout from './template';

export default Component.extend({
  tagName: '',
  layout,
  osx: navigator.platform.match(/Mac/),

  hint: reads('for'),

  keyboardShortcut: computed('for', {
    get() {
      let commands = get(this, 'editor.editor').keyCommands;
      let markup = this['for'];
      let command = commands.find(function (command) {
        return command.run.toString().toLowerCase().indexOf(`'${markup}'`) !== -1 ||
          command.run.toString().toLowerCase().indexOf(`"${markup}"`) !== -1 ||
          (markup.length > 1 && command.run.toString().toLowerCase().indexOf(markup) !== -1);
      });

      if (command) {
        return htmlSafe(command.str.toLowerCase()
          .replace('meta', 'ctrl')
          .replace('ctrl', this.osx ? '&#8984;' : 'ctrl'));
      }
    }
  })
});

