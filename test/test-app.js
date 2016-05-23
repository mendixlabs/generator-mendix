/*global it,before,describe*/
/*jshint -W108,-W069*/
'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var format = require('string-template');
var mockSpawn = require('mock-spawn');

describe('Generator:', function () {

  var customWidgetName = 'TESTWIDGET';
  var mySpawn = mockSpawn();
  require('child_process').spawn = mySpawn;

  mySpawn.setDefault(mySpawn.simple(0, ''));

  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ widgetName: customWidgetName })
      .toPromise();
  });

  describe('Copy/create', function () {
    it('creates files from generator', function () {
      assert.file([
        'Gruntfile.js',
        'package.json',
        '.editorconfig',
        '.gitignore'
      ]);
    });

    it('copies generic files from AppStoreWidgetBoilerPlate', function () {
      assert.file([
        '.jshintrc',
        'src/package.xml',
        'test/Test.mpr',
        'xsd/widget.xsd',
        'assets/app_store_banner.png',
        'assets/app_store_icon.png'
      ]);
    });

    it(format('copies files from AppStoreWidgetBoilerPlate based on widgetName ({0})', customWidgetName), function () {
      assert.file([
        format('src/{0}/{0}.xml', [customWidgetName]),
        format('src/{0}/lib/jquery-1.11.2.js', [customWidgetName]),
        format('src/{0}/widget/{0}.js', [customWidgetName]),
        format('src/{0}/widget/template/{0}.html', [customWidgetName]),
        format('src/{0}/widget/ui/{0}.css', [customWidgetName])
      ]);
    });
  });

  describe('Javascript format', function() {
    var jsFile = format('src/{0}/widget/{0}.js', [customWidgetName]);

    it('declare', function () {
      assert.fileContent(jsFile, format('return declare("{0}.widget.{0}", [ _WidgetBase, _TemplatedMixin ], {', [customWidgetName]));
    });

    it('require', function () {
      assert.fileContent(jsFile, format('require(["{0}/widget/{0}"]);', [customWidgetName]));
    });

  });

  describe('Widget XML format', function() {
    var xmlFile = format('src/{0}/{0}.xml', [customWidgetName]);

    it('declare', function () {
      assert.fileContent(xmlFile, format('<widget id="{0}.widget.{0}" ', [customWidgetName]));
    });
    it('require', function () {
      assert.fileContent(xmlFile, format('<name>{0}</name>', [customWidgetName]));
    });
  });

  describe('Package XML format', function() {
    var xmlFile = 'src/package.xml';

    it('clientModule', function () {
      assert.fileContent(xmlFile, format('<clientModule name="{0}" version="1.0.0" xmlns="http://www.mendix.com/clientModule/1.0/">', [customWidgetName]));
    });

    it('widgetFiles', function () {
      assert.fileContent(xmlFile, format('<widgetFile path="{0}/{0}.xml" />', [customWidgetName]));
    });

    it('file paths', function () {
      assert.fileContent(xmlFile, format('<file path="{0}/widget/" />', [customWidgetName]));
    });
  });

});
