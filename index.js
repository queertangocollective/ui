/* eslint-env node */
'use strict';
const Funnel = require('broccoli-funnel');

module.exports = {
  name: '@queertangocollective/ui',

  included() {
    this._super.included.apply(this, arguments);
  },

  treeForPublic(tree) {
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
