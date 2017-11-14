/*jslint node: true */
'use strict';

const fs = require('fs');

// process.stdout.write is asynchronous and can cause excessive memory drain
// when used in a loop. This solution will make stdout synchronous.
// Inspired by: https://github.com/litmit/console-sync
function writeSync(message) {
  fs.writeSync(process.stdout.fd, message);
}

/**
 * For longer builds, this plugin periodically prints to the
 * console to reset any timeouts associated with watched output.
 * More info:
 * https://docs.travis-ci.com/user/common-build-problems/#Build-times-out-because-no-output-was-received
 *
 * @name OutputKeepAlivePlugin
 * @param {any} options
 */
function OutputKeepAlivePlugin(options = {}) {
  this.apply = function (compiler) {
    if (!options.enabled) {
      return;
    }

    compiler.plugin('compilation', function (compilation) {
      // More hooks found on the docs:
      // https://webpack.js.org/api/compilation/
      compilation.plugin('build-module', function () {
        writeSync('.');
      });
    });
  };
}

module.exports = { OutputKeepAlivePlugin };
