/*jshint -W108,-W069*/
"use strict";

var chalk = require('chalk');

module.exports = {
  getBanner: function (pkg) {
    return [
      '',
      chalk.bold.cyan('  __  ____   __') + '           _     _            _    ',
      chalk.bold.cyan(' |  \\/  \\ \\ / /') + '          (_)   | |          | |   ',
      chalk.bold.cyan(' | \\  / |\\ V / ') + ' __      ___  __| | __ _  ___| |_  ',
      chalk.bold.cyan(' | |\\/| | > <  ') + ' \\ \\ /\\ / / |/ _` |/ _` |/ _ \\ __| ',
      chalk.bold.cyan(' | |  | |/ . \\ ') + '  \\ V  V /| | (_| | (_| |  __/ |_  ',
      chalk.bold.cyan(' |_|  |_/_/ \\_\\') + '   \\_/\\_/ |_|\\__,_|\\__, |\\___|\\__| ',
      '                                   __/ |          ',
      '                                  |___/           ',
      ' Generator, version: ' + pkg.version,
      ' Issues? Please report them at : ' + chalk.cyan(pkg.bugs.url),
      ''
    ].join('\n');
  },

  PACKAGE_READ_ERROR: "Error reading package.json. Please check the file or remove it before you run the generator again. Error: ",
  DIR_NOT_EMPTY_ERROR: chalk.bold.red(' The directory is not empty and we cannot detect a widget.\n If you are creating a new widget, please open the generator in an empty folder.\n If you want to upgrade a widget, make sure you are using the generator in a widget folder.\n'),

  INSTALL_FINISH_MSG: 'Copied files, now running ' + chalk.cyan('npm install') + ' to install development dependencies',
  END_NPM_NEED_INSTALL_MSG: '\n\n> Dependencies should be installed using ' + chalk.cyan('npm install') + ' before I can run the build using ' + chalk.cyan('npm run build') + ' < \n\n',
  END_RUN_BUILD_MSG: '\n\n> I will now run ' + chalk.cyan('npm run build') + ' to build the mpk (do this before starting the modeler)< \n\n'
};
