'use babel';

import { exec } from 'child_process';
import { quote } from 'shell-quote';

import Collector from './Collector';

export default {
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
