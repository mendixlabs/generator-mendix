// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %> :: http://github.com/<%= pkg.repository.url %>
'use strict';

var path = require('path'),
    mendixApp = require('node-mendix-modeler-path'),
    base64 = require('node-base64-image'),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser(),
    builder = new xml2js.Builder(),
    shelljs = require('shelljs');

// In case you seem to have trouble starting Mendix through `grunt start-mendix`, you might have to set the path to the Mendix application.
// If it works, leave MODELER_PATH at null
var MODELER_PATH = null;
var MODELER_ARGS = '/file:{path}';

// In case you have a different path to the test project (currently in ./test/Test.mpr) point TEST_PATH to the Test-project (full path). Otherwise, leave at null
var TEST_PATH = null;
// Use this example if you want to point it to a different subfolder and specific Test project Name:
// var TEST_PATH = path.join(shelljs.pwd(), './<custom folder>/<Custom Test Project Name>.mpr');

module.exports = function (grunt) {
  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    watch: {
      autoDeployUpdate: {
        'files': [ './src/**/*' ],
        'tasks': [ 'compress', 'newer:copy' ],
        options: {
          debounceDelay: 250,
          livereload: true
        }
      }
    },
    compress: {
      makezip: {
        options: {
          archive: './dist/' + pkg.name + '.mpk',
          mode: 'zip'
        },
        files: [{
            expand: true,
            date: new Date(),
            store: false,
            cwd: './src',
            src: ['**/*']
          }]
      }
    },
    copy: {
      deployment: {
        files: [
          { dest: './test/deployment/web/widgets', cwd: './src/', src: ['**/*'], expand: true }
        ]
      },
      mpks: {
        files: [
          { dest: './test/widgets', cwd: './dist/', src: [ pkg.name + '.mpk'], expand: true }
        ]
      }
    },
    clean: {
      build: [
          './dist/' + pkg.name + '/*',
          './test/deployment/web/widgets/' + pkg.name + '/*',
          './test/widgets/' + pkg.name + '.mpk'
        ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('start-modeler', function () {
    var done = this.async(),
        testProjectPath = TEST_PATH !== null ? TEST_PATH : path.join(shelljs.pwd(), '/test/Test.mpr');

    if (MODELER_PATH !== null || (mendixApp.err === null && mendixApp.output !== null && mendixApp.output.cmd && mendixApp.output.arg)) {
      grunt.util.spawn({
        cmd: MODELER_PATH || mendixApp.output.cmd,
        args: [
          (MODELER_PATH !== null ? MODELER_ARGS : mendixApp.output.arg).replace('{path}', testProjectPath)
        ]
      }, function () {
        done();
      });
    } else {
      console.error('Cannot start Modeler, see error:');
      console.log(mendixApp.err);
      done();
    }
  });

  grunt.registerTask('generate-icon', function () {
    var iconPath = path.join(shelljs.pwd(), '/icon.png'),
        widgetXml = path.join(shelljs.pwd(), '/src/', pkg.name, '/', pkg.name + '.xml'),
        options = {localFile: true, string: true},
        done = this.async();

    grunt.log.writeln('Processing icon');

    if (!grunt.file.exists(iconPath) || !grunt.file.exists(widgetXml)) {
      grunt.log.error('can\'t generate icon');
      return done();
    }

    base64.base64encoder(iconPath, options, function (err, image) {
      if (!err) {
        var xmlOld = grunt.file.read(widgetXml);
        parser.parseString(xmlOld, function (err, result) {
          if (!err) {
            if (result && result.widget && result.widget.icon) {
              result.widget.icon[0] = image;
            }
            var xmlString = builder.buildObject(result);
            grunt.file.write(widgetXml, xmlString);
            done();
          }
        });
      }
    });
  });

  grunt.registerTask('start-mendix', [ 'start-modeler' ]);

  grunt.registerTask(
    'default',
    'Watches for changes and automatically creates an MPK file, as well as copying the changes to your deployment folder',
    [ 'watch' ]
  );

  grunt.registerTask(
    'clean build',
    'Compiles all the assets and copies the files to the build directory.',
    [ 'clean', 'compress', 'copy' ]
  );

  grunt.registerTask(
    'build',
    [ 'clean build' ]
  );
};
