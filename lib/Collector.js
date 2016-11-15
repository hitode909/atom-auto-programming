'use babel';

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

  horizontal (query) {
  }

  vertical (query) {
  }
}
