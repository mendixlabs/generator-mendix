/*global it,before,describe*/
/*jshint -W108,-W069*/
'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var format = require('string-template');
var mockSpawn = require('mock-spawn');
var fs = require("fs-extra");
var builder = 'gulp';

describe(format('Generator on non-empty folder, upgrading a widget, using gulp:\n', builder), function () {

  var mySpawn = mockSpawn();
  require('child_process').spawn = mySpawn;

  mySpawn.setDefault(mySpawn.simple(0, ''));

  before(function () {
    return helpers.run(path.join(__dirname, '../../generators/app'))
      .inTmpDir(function (dir) {
        try {
          fs.copySync(path.join(__dirname, '../../generators/app/templates/AppStoreWidgetBoilerplate/src'), dir + '/src');
        } catch (err) {
          throw new Error(err);
        }
      })
      .withPrompts({
        upgrade: true,
        version: "1.0.0",
        builder: "gulp"
      })
      .withOptions({ skipInstall: true })
      .toPromise();
  });

  describe('Break on non empty folder', function () {
    it('creates files from generator', function () {
      assert.file([
        builder === 'gulp' ? 'Gulpfile.js' : 'Gruntfile.js',
        'package.json',
        '.editorconfig',
        '.gitignore'
      ]);
    });
  });
});
