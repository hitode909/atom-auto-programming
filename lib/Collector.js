'use babel';

import { exec } from 'child_process';
import { quote } from 'shell-quote';

export default class Collector {
  constructor (projectRoot) {
    this.projectRoot = projectRoot;
  }

  // " hi " to "hi"
  trim (str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  // "hi there" to "there"
  shorten (str) {
    return str.replace(/^\s*\S*\s*/, '');
  }

  // (my $a =, =, my $b = 2) to my $a = 2
  merge (original, query, found) {
    const index1 = original.indexOf(query);
    const index2 = found.indexOf(query);
    return original.substr(0, index1) + found.substr(index2);
  }

  horizontal (query, skip) {
    return new Promise((resolve) => {
      if (!query) {
        return resolve([])
      }

      if (!skip) {
        skip = 0;
      }

      var shortQuery = query;
      for (var i = 0; i < skip; i++) {
        shortQuery = this.shorten(shortQuery);
      }

      if (!shortQuery) {
        resolve([]);
      }

      const command = quote(['git', 'grep', '--fixed-strings', '-h', shortQuery]);

      exec(command, {cwd: this.projectRoot}, (err, stdout, stderr) => {
        const lines = stdout.split(/\n/);

        if (!lines.length > 0) {
          return this.horizontal(query, ++skip).then((candidates) => {
            resolve(candidates);
          });
        }

        const counts = {};

        lines.forEach(line => {
          const candidate = this.merge(query, shortQuery, this.trim(line));
          if (!candidate.length > 0) {
            return;
          }
          if (candidate == shortQuery) {
            return;
          }
          counts[candidate] += 1;
        });

        const sorted = Object.keys(counts).sort((a, b)=> counts[b] - counts[a]);
        resolve(sorted);
      });
    });
  }

  vertical (query) {
  }
}
