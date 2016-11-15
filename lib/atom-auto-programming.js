'use babel';

import AtomAutoProgrammingView from './atom-auto-programming-view';
import { CompositeDisposable } from 'atom';

import { exec } from 'child_process';

import { quote } from 'shell-quote';

var s = quote([ 'a', 'b c d', '$f', '"g"' ]);
console.log(s);

export default {
  atomAutoProgrammingView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomAutoProgrammingView = new AtomAutoProgrammingView(state.atomAutoProgrammingViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomAutoProgrammingView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-auto-programming:toggle': () => this.toggle()
    }));
  },
  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomAutoProgrammingView.destroy();
  },

  serialize() {
    return {
      atomAutoProgrammingViewState: this.atomAutoProgrammingView.serialize()
    };
  },

  toggle() {
    console.log('auto programimng!');
    const rootPath = atom.project.rootDirectories[0].path;
    console.log(rootPath);
    const lineContent = atom.workspace.getActivePane().getActiveItem().cursors[0].getCurrentBufferLine();
    const trimmedLineContent = lineContent.replace(/^\s+/, '').replace(/\s+$/, '');
    const command = `michizane horizontal '${trimmedLineContent}'`;
    console.log(command);
    exec(command, {cwd: rootPath}, (err, stdout, stderr) => {
      console.log([err, stdout, stderr]);
      console.log(stdout);
    });
    return;
    console.log('AtomAutoProgramming was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },
  provide() {
    console.log('getProvider!');
    return {
      selector: '.source',
      getSuggestions: (request) => {
        console.log('privide?')
        if (!request.activatedManually) {
          console.log('none');
          return [];
        }
        return new Promise((resolve) => {
          console.log(atom);
          console.log(request);
          console.log('getSuggestions!');
          const cursor = request.editor.cursors[0];
          const lineContent = cursor.getCurrentBufferLine().replace(/^\s+/, '').replace(/\s+$/, '')
          const prevLineContent = cursor.getBufferRow() > 0 ? request.editor.lineTextForBufferRow(cursor.getBufferRow()-1).replace(/^\s+/, '').replace(/\s+$/, '') : '';
          const command = lineContent ? quote(['michizane', 'horizontal', lineContent]) : quote(['michizane', 'vertical', prevLineContent]);
          console.log(command);
          const rootPath = atom.project.rootDirectories[0].path;
          console.log(rootPath);
          exec(command, {cwd: rootPath}, (err, stdout, stderr) => {
            const candidates = stdout.split(/\n/).map((line) => {
              return {
                text: line,
                replacementPrefix: lineContent,
                type: 'snippet',
                description: 'Auto Programming',
              }
            });
            console.log(candidates);
            resolve(candidates);
          });
        });
      },
      onDidInsertSuggestion: (response) => {
        console.log('inserted!');
        atom.commands.dispatch(atom.views.getView(response.editor), 'editor:newline');
        setTimeout(() => {
          atom.commands.dispatch(atom.views.getView(response.editor), 'autocomplete-plus:activate');
        }, 0);
      }
    }
  }
};
