import { schedule, run, begin, end, join } from '@ember/runloop';
import { copy } from '@ember/object/internals';
import Component from '@ember/component';
import EmberObject, { computed, set, get } from '@ember/object';
import createComponentCard from 'ember-mobiledoc-editor/utils/create-component-card';
import Editor from 'mobiledoc-kit/editor/editor';
import { MOBILEDOC_VERSION } from 'mobiledoc-kit/renderers/mobiledoc';
import layout from './template';
import isMobile from '../../system/mobile';

const EDITOR_CARD_SUFFIX = '-editor';
export const ADD_CARD_HOOK = 'addComponent';
export const REMOVE_CARD_HOOK = 'removeComponent';
export const ADD_ATOM_HOOK = 'addAtomComponent';
export const REMOVE_ATOM_HOOK = 'removeAtomComponent';

let uuid = 0;

function arrayToMap(array) {
  let map = Object.create(null);
  array.forEach(key => {
    if (key) { // skip undefined/falsy key values
      map[key] = true;
    }
  });
  return map;
}

function lineBreakParser(node, builder, { addMarkerable, nodeFinished }) {
  if (node.nodeType !== 1 || node.tagName !== 'BR') {
    return;
  }
  addMarkerable(builder.createAtom('line-break', '', {}));
  nodeFinished();
}

const EMPTY_MOBILEDOC = {
  "version": MOBILEDOC_VERSION,
  "atoms": [],
  "cards": [],
  "markups": [],
  "sections": [
    [
      1,
      "p",
      []
    ]
  ]
};

export default Component.extend({
  classNames: ['text-editor'],
  tagName: 'article',
  layout,

  isMobile,

  placeholder: null,
  spellcheck: true,
  autofocus: true,

  buttons: computed('markup', function () {
    let buttons = [{
      type: 'strong',
      label: 'Bold',
      icon: 'bold'
    }, {
      type: 'em',
      label: 'Italic',
      icon: 'italic'
    }, {
      type: 'u',
      label: 'Underline',
      icon: 'underline'
    }, {
      type: 'blockquote',
      label: 'Quote',
      icon: 'quote'
    }, {
      type: 'a',
      label: 'Link',
      icon: 'link'
    }, {
      type: 'photo',
      label: 'Add Photo',
      icon: 'photo'
    }, {
      type: 'youtube',
      label: 'Embed Youtube Video',
      icon: 'youtube'
    }];

    // Mobile OSes have robust emoji keyboards
    if (!get(this, 'isMobile')) {
      buttons.push({
        type: 'emoji',
        label: 'Add Emoji',
        icon: 'emoji'
      });
    }

    if (get(this, 'markup')) {
      return get(this, 'markup').map((name) => {
        return buttons.findBy('icon', name);
      });
    }
    return buttons;
  }),

  init() {
    this._super(...arguments);
    set(this, 'componentCards', []);
    set(this, 'componentAtoms', []);

    set(this, 'cards', [
      createComponentCard('photo'),
      createComponentCard('youtube')
    ]);
    set(this, 'atoms', [{
      name: 'line-break',
      type: 'dom',
      render() {
        return document.createElement('br');
      }
    }]);

    this._startedRunLoop = false;
  },

  willRender() {
    // Use a default mobiledoc. If there are no changes, then return early.
    let mobiledoc = get(this, 'mobiledoc');
    if (((this._localMobiledoc && this._localMobiledoc === mobiledoc) ||
         (this._upstreamMobiledoc && this._upstreamMobiledoc === mobiledoc)) &&
        (this._lastDisabled === get(this, 'disabled'))) {
      // No change to mobiledoc, no need to recreate the editor
      return;
    }

    this._lastDisabled = get(this, 'disabled');
    this._upstreamMobiledoc = mobiledoc;
    this._localMobiledoc = null;

    // Teardown any old editor that might be around.
    let editor = get(this, 'editor');
    if (editor) {
      editor.destroy();
    }

    // Create a new editor.
    let componentHooks = {
      [ADD_CARD_HOOK]: ({env, options, payload}, isEditing=false) => {
        let cardId = `card-${uuid++}`;
        let cardName = env.name;
        if (isEditing) {
          cardName = cardName + EDITOR_CARD_SUFFIX;
        }
        let destinationElementId = `mobiledoc-editor-card-${cardId}`;
        let element = document.createElement('div');
        element.id = destinationElementId;

        // The data must be copied to avoid sharing the reference
        payload = copy(payload, true);

        let card = EmberObject.create({
          destinationElementId,
          cardName,
          payload,
          env,
          options,
          editor,
          postModel: env.postModel
        });
        schedule('afterRender', () => {
          get(this, 'componentCards').pushObject(card);
        });
        return { card, element };
      },
      [ADD_ATOM_HOOK]: ({env, options, payload, value}) => {
        let atomId = `atom-${uuid++}`;
        let atomName = env.name;
        let destinationElementId = `mobiledoc-editor-atom-${atomId}`;
        let element = document.createElement('span');
        element.id = destinationElementId;

        // The data must be copied to avoid sharing the reference
        payload = copy(payload, true);

        let atom = EmberObject.create({
          destinationElementId,
          atomName,
          payload,
          value,
          callbacks: env,
          options,
          editor,
          postModel: env.postModel
        });
        schedule('afterRender', () => {
          get(this, 'componentAtoms').pushObject(atom);
        });
        return { atom, element };
      },
      [REMOVE_CARD_HOOK]: (card) => {
        get(this, 'componentCards').removeObject(card);
      },
      [REMOVE_ATOM_HOOK]: (atom) => {
        get(this, 'componentAtoms').removeObject(atom);
      }
    };

    editor = new Editor({
      placeholder: get(this, 'placeholder') || '',
      spellcheck: get(this, 'spellcheck'),
      autofocus: get(this, 'autofocus'),
      cards: get(this, 'cards'),
      atoms: get(this, 'atoms'),
      mobiledoc,
      cardOptions: componentHooks,
      parserPlugins: [lineBreakParser]
    });

    editor.willRender(() => {
      // The editor's render/rerender will happen after this `editor.willRender`,
      // so we explicitly start a runloop here if there is none, so that the
      // add/remove card hooks happen inside a runloop.
      // When pasting text that gets turned into a card, for example,
      // the add card hook would run outside the runloop if we didn't begin a new
      // one now.
      if (!run.currentRunLoop) {
        this._startedRunLoop = true;
        begin();
      }
    });

    editor.didRender(() => {
      // If we had explicitly started a run loop in `editor.willRender`,
      // we must explicitly end it here.
      if (this._startedRunLoop) {
        this._startedRunLoop = false;
        end();
      }
    });

    editor.postDidChange(() => {
      join(() => {
        this.postDidChange(editor);
      });
    });

    editor.inputModeDidChange(() => {
      if (this.isDestroyed) { return; }
      join(() => {
        this.inputModeDidChange(editor);
      });
    });

    editor.registerKeyCommand({
      str: 'SHIFT+ENTER',
      run(editor) {
        editor.insertAtom('line-break', '', {});
      }
    });

    if (get(this, 'disabled')) {
      editor.disableEditing();
    }
    set(this, 'editor', editor);
  },

  didRender() {
    let editor = get(this, 'editor');
    if (!editor.hasRendered) {
      let editorElement = this.$('.mobiledoc-editor__editor')[0];
      this._isRenderingEditor = true;
      editor.render(editorElement);
      this._isRenderingEditor = false;
    }
  },

  willDestroyElement() {
    let editor = get(this, 'editor');
    editor.destroy();
  },

  mobiledoc: computed({
    get() {
      if (get(this, 'value') == null ||
          get(this, 'value') === '') {
        return EMPTY_MOBILEDOC;
      }
      try {
        return JSON.parse(get(this, 'value')) || EMPTY_MOBILEDOC;
      } catch (e) {
        return EMPTY_MOBILEDOC;
      }
    }
  }),

  postDidChange(editor) {
    let serializeVersion = this.get('serializeVersion');
    let updatedMobileDoc = editor.serialize(serializeVersion);
    this._localMobiledoc = updatedMobileDoc;
    get(this, 'onchange')(JSON.stringify(updatedMobileDoc));
  },

  inputModeDidChange(editor) {
    const markupTags = arrayToMap(editor.activeMarkups.map(m => m.tagName));
    // editor.activeSections are leaf sections.
    // Map parent section tag names (e.g. 'p', 'ul', 'ol') so that list buttons
    // are updated.
    let sectionParentTagNames = editor.activeSections.map(s => {
      return s.isNested ? s.parent.tagName : s.tagName;
    });
    const sectionTags = arrayToMap(sectionParentTagNames);

    // Avoid updating this component's properties synchronously while
    // rendering the editor (after rendering the component) because it
    // causes Ember to display deprecation warnings
    if (this._isRenderingEditor) {
      schedule('afterRender', () => {
        this.set('activeMarkupTagNames', markupTags);
        this.set('activeSectionTagNames', sectionTags);
      });
    } else {
      this.set('activeMarkupTagNames', markupTags);
      this.set('activeSectionTagNames', sectionTags);
    }
  },

  addCard(cardName, payload, isEditing=false) {
    get(this, 'editor').insertCard(cardName, payload, isEditing);
  },

  actions: {
    upload(file) {
      let editor = this.get('editor');
      let range = editor.range;
      return get(this, 'onupload')(file).then((photo) => {
        editor.selectRange(range);
        this.addCard('photo', {
          id: get(photo, 'id'),
          url: get(photo, 'url'),
          title: get(photo, 'title'),
          caption: get(photo, 'caption')
        });
      });
    },

    openForm(component) {
      if (this.get('form.component') === component) {
        let range = get(this, 'form.range');
        this.set('form', null);
        this.get('editor').selectRange(range);
        return;
      }

      let editor = this.get('editor');
      if (!editor.hasCursor()) {
        return;
      }
      if (editor.hasActiveMarkup('a')) {
        editor.toggleMarkup('a');
      } else {
        this.set('form', {
          range: editor.range,
          component
        });
      }
    },

    addLink(href) {
      let range = get(this, 'form.range');
      this.set('form', null);
      let editor = this.get('editor');
      editor.selectRange(range);
      editor.toggleMarkup('a', { href });
    },

    toggleMarkup(editor, forProperty) {
      editor.toggleMarkup(forProperty);
    },

    toggleSection(editor, forProperty) {
      editor.toggleSection(forProperty);
    },

    addYoutubeEmbed(url) {
      let { range } = this.get('form');
      this.set('form', null);
      let editor = this.get('editor');
      editor.selectRange(range);
      this.addCard('youtube', {
        url,
        width: 640,
        height: 360,
        autoplay: false
      });
    },

    addEmoji(emoji) {
      let { range } = this.get('form');
      this.set('form', null);
      let editor = this.get('editor');
      editor.selectRange(range);
      editor.insertText(emoji);
    }
  }
});
