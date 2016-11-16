'use babel';

import Collector from './Collector';

const trim = (str) => {
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

export default {
  provide() {
    return {
      selector: '.source',
      getSuggestions: (request) => {
        if (!request.activatedManually) {
          return [];
        }

        return new Promise(resolve => {
          const collector = new Collector(atom.project.rootDirectories[0].path);

          const cursor = request.editor.cursors[0];
          const lineContent = trim(cursor.getCurrentBufferLine());

          let collecting;
          if (lineContent) {
            collecting = collector.horizontal(lineContent);
          } else if (cursor.getBufferRow() > 0) {
            const prevLineContent = trim(request.editor.lineTextForBufferRow(cursor.getBufferRow()-1));
            collecting = collector.vertical(prevLineContent);
          } else {
            resolve([]);
            return;
          }

          collecting.then(searchResult => {
            const candidates = searchResult.map((item) => {
              return {
                text: item.text,
                replacementPrefix: lineContent,
                type: 'snippet',
                description: `Seen ${item.count} time${item.count > 1 ? 's' : ''}`,
              }
            });
            resolve(candidates);
          });
        });
      },
      onDidInsertSuggestion: (response) => {
        const editorView = atom.views.getView(response.editor);
        atom.commands.dispatch(editorView, 'editor:newline');
        setTimeout(() => {
          atom.commands.dispatch(editorView, 'autocomplete-plus:activate');
        }, 0);
      }
    }
  }
};
