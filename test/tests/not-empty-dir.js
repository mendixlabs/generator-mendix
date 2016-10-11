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

describe(format('Generator on non-empty folder:\n', builder), function () {

  var mySpawn = mockSpawn();
  require('child_process').spawn = mySpawn;

  mySpawn.setDefault(mySpawn.simple(0, ''));

  before(function () {
    return helpers.run(path.join(__dirname, '../../generators/app'))
      .inTmpDir(function (dir) {
        fs.copySync(path.join(__dirname, '../test.js'), dir + '/test.js');
      })
      .withOptions({ skipInstall: true })
      .toPromise();
  });

  describe('Break on non empty folder', function () {
    it('Leave original files there', function () {
      assert.file([
        'test.js'
      ]);
    });
    it('Does not copy any files', function () {
      assert.noFile([
        builder === 'gulp' ? 'Gulpfile.js' : 'Gruntfile.js',
        'package.json',
        '.editorconfig',
        '.gitignore',
        '.jshintrc',
        'src/package.xml',
        'test/Test.mpr',
        'xsd/widget.xsd',
        'assets/app_store_banner.png',
        'assets/app_store_icon.png'
      ]);
    });
  });
});
