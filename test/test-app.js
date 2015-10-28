'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var format = require('string-template');

describe('Mendix generator:', function () {

  var customWidgetName = 'TESTWIDGET';

  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ widgetName: customWidgetName })
      .on('end', done);
  });

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

  // TODO: Check if the custom files use the correct prompts
  // it('creates a custom package.json', function () {
  //   assert.noFileContent('Gruntfile.js');
  // });
});
