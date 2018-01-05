/* eslint-env node */
'use strict';
const Funnel = require('broccoli-funnel');

module.exports = {
  name: '@queertangocollective/ui',

  addonPath(path) {
    return `node_modules/@queertangocollective/ui/${path}`;
  },

  included() {
    this._super.included.apply(this, arguments);
  },

  treeForPublic() {
    this._requireBuildPackages();

    if (!tree) {
      return tree;
    }

    return new Funnel(tree, {
      srcDir: '/',
      destDir: '/'
    });
  }
};
