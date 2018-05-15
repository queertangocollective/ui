'use strict';
const Funnel = require('broccoli-funnel');

module.exports = {
  name: '@queertangocollective/ui',

  included(app) {
    this._super.included.apply(this, arguments);
    app.import('node_modules/@glimmer/reference/dist/amd/es5/glimmer-reference.js');
    app.import('node_modules/@glimmer/util/dist/amd/es5/glimmer-util.js');
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
