/*global it,before,describe*/
/*jshint -W108,-W069*/
'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var format = require('string-template');
var mockSpawn = require('mock-spawn');
var _ = require('lodash');

module.exports = function (builder, prompt) {
  var promptOps = _.assign(require('./prompt-options.js')(), prompt || {});
  promptOps.widgetName = 'TestWidgetForTHE' + builder;
  promptOps.builder = builder;

  var jquery = promptOps.widgetoptions && promptOps.widgetoptions.indexOf('jquery') !== -1,
      templates = promptOps.widgetoptions && promptOps.widgetoptions.indexOf('templates') !== -1;

  describe(format('Generator using empty boilerplate with {0}, jquery={1}, templates={2}:\n', builder, jquery, templates), function () {

    var mySpawn = mockSpawn();
    require('child_process').spawn = mySpawn;

    mySpawn.setDefault(mySpawn.simple(0, ''));

    before(function () {
      return helpers.run(path.join(__dirname, '../../generators/app'))
        .withOptions({ skipInstall: true })
        .withPrompts(promptOps)
        .toPromise();
    });

    describe('Copy/create', function () {
      it('creates files from generator', function () {
        assert.file([
          builder === 'gulp' ? 'Gulpfile.js' : 'Gruntfile.js',
          'package.json',
          '.editorconfig',
          '.gitignore',
          '.jshintrc'
        ]);
      });

      it('copies generic files from AppStoreWidgetBoilerPlate', function () {
        assert.file([
          'src/package.xml',
          'test/Test.mpr',
          'xsd/widget.xsd',
          'assets/app_store_banner.png',
          'assets/app_store_icon.png'
        ]);
      });

      it(format('Create files for {0}', promptOps.widgetName), function () {
        assert.file([
          format('src/{0}/{0}.xml', [promptOps.widgetName]),
          format('src/{0}/widget/{0}.js', [promptOps.widgetName]),
          format('src/{0}/widget/ui/{0}.css', [promptOps.widgetName])
        ]);
      });

      it (format('Based on input, jQuery library should{0} be copied', (jquery ? '' : ' NOT')), function () {
        if (jquery) {
          assert.file([
            format('src/{0}/lib/jquery-1.11.2.js', [promptOps.widgetName])
          ]);
        } else {
          assert.noFile([
            format('src/{0}/lib/jquery-1.11.2.js', [promptOps.widgetName])
          ]);
        }
      });
      it (format('Based on input, templates should{0} be copied', (templates ? '' : ' NOT')), function () {
        if (templates) {
          assert.file([
            format('src/{0}/widget/template/{0}.html', [promptOps.widgetName])
          ]);
        } else {
          assert.noFile([
            format('src/{0}/widget/template/{0}.html', [promptOps.widgetName])
          ]);
        }
      });
    });

    describe('Javascript widget file', function() {
      var jsFile = format('src/{0}/widget/{0}.js', [promptOps.widgetName]);

      it('should declare with the name set in the widget generator', function () {
        assert.fileContent(jsFile, format('return declare("{0}.widget.{0}"', [promptOps.widgetName]));
      });

      it('will require the widget based on the name set in the widget generator', function () {
        assert.fileContent(jsFile, format('require(["{0}/widget/{0}"]);', [promptOps.widgetName]));
      });

      it (format('Based on input, jQuery library should{0} be required in the widget', (jquery ? '' : ' NOT')), function () {
        var contents = [
          [jsFile, format('{0}/lib/jquery-1.11.2', [promptOps.widgetName])],
          [jsFile, '_jQuery'],
          [jsFile, 'var $ = _jQuery.noConflict(true);']
        ];
        if (jquery) {
          assert.fileContent(contents);
        } else {
          assert.noFileContent(contents);
        }
      });
      it (format('Based on input, templates should{0} be required in the widget', (templates ? '' : ' NOT')), function () {
        var contents = [
          [jsFile, format('dojo/text!{0}/widget/template/{0}.html', [promptOps.widgetName])],
          [jsFile, '_TemplatedMixin'],
          [jsFile, 'widgetTemplate'],
          [jsFile, 'templateString: widgetTemplate'],
          [jsFile, 'widgetBase: null,']
        ];
        if (templates) {
          assert.fileContent(contents);
        } else {
          assert.noFileContent(contents);
        }
      });
    });

    describe('Widget XML format', function() {
      var xmlFile = format('src/{0}/{0}.xml', [promptOps.widgetName]);

      it('has a widget declaration with proper id', function () {
        assert.fileContent(xmlFile, format('<widget id="{0}.widget.{0}" ', [promptOps.widgetName]));
      });
      it('has a the name set by the generator', function () {
        assert.fileContent(xmlFile, format('<name>{0}</name>', [promptOps.widgetName]));
      });
      it('has a dummy key in the widget xml', function () {
        assert.fileContent(xmlFile, '<property key="dummyKey" type="string" required="false" defaultValue="">');
      });
    });

    describe('Package XML format', function() {
      var xmlFile = 'src/package.xml';

      it('has a clientModule node with the version number set in the generator', function () {
        assert.fileContent(xmlFile, format('<clientModule name="{0}" version="{1}" xmlns="http://www.mendix.com/clientModule/1.0/">', [promptOps.widgetName, promptOps.version]));
      });

      it('has a widgetFile node that points to the proper widget XML', function () {
        assert.fileContent(xmlFile, format('<widgetFile path="{0}/{0}.xml" />', [promptOps.widgetName]));
      });

      it('has a file node that points to the widget files', function () {
        assert.fileContent(xmlFile, format('<file path="{0}/widget/" />', [promptOps.widgetName]));
      });
    });

  });
};
