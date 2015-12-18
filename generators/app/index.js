/*jshint -W108*/
'use strict';

var pkg = require(__dirname + '/../../package.json');
var semver = require('semver');
var fs = require('extfs');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var boilerPlatePath = '/AppStoreWidgetBoilerplate/';

var banner = [
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

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    if (!fs.isEmptySync(this.destinationRoot())) {
      this.log(banner);
      this.log(chalk.red('Error: Current folder does not seem to be empty, the generator needs to be run in an empty folder. Please create an empty folder first.\n'));
      process.exit(0);
    }
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(banner);

    var prompts = [
      {
        type: 'input',
        name: 'widgetName',
        validate: function (input) {
          if (/^([a-zA-Z]*)$/.test(input)) { return true; }
          return 'Your widget can only contain letters (a-z & A-Z). Please provide a valid name';
        },
        message: 'What is name of your widget?',
        default: 'MyWidget'
      },{
        type: 'input',
        name: 'description',
        message: 'Enter a description for your widget',
        default: 'My brand new Mendix widget'
      },{
        type: 'input',
        name: 'copyright',
        message: 'Add a copyright',
        default: '<Your Company> 2015',
        store: true
      },{
        type: 'input',
        name: 'license',
        message: 'Add a license',
        default: 'Apache 2',
        store: true
      },{
        type: 'input',
        name: 'version',
        validate: function (input) {
          if (semver.valid(input) && semver.satisfies(input, '>=1.0.0')) {
            return true;
          }
          return 'Your version needs to be formatted as x.x.x and starts at 1.0.0. Using 1.0.0';
        },
        message: 'Initial version',
        default: '1.0.0'
      },{
        type: 'input',
        name: 'author',
        message: 'Author',
        default: '<You>',
        store: true
      },{
        type: 'input',
        name: 'github',
        message: 'Github username (optional)',
        default: '<none>',
        store: true
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));

  },

  writing: {
    app: function () {

      // Define widget variables
      this.widget = {};
      this.widget.widgetName = this.props.widgetName;
      this.widget.packageName = this.props.widgetName;
      this.widget.description = this.props.description;
      this.widget.version = this.props.version;
      this.widget.author = this.props.author;
      this.widget.date = (new Date()).toLocaleDateString();
      this.widget.copyright = this.props.copyright;
      this.widget.license = this.props.license;
      this.widget.github = this.props.github !== '<none>' ? '"http://github.com/' + this.props.github + '/' + this.widget.widgetName + '"' : false;

      // Using grunt (future version will include Gulp)
      this.widget.builder = 'grunt';

      // Copy generic files
      this.fs.copy(this.templatePath(boilerPlatePath + '.jshintrc'), this.destinationPath('.jshintrc'));
      this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('icon.png'), this.destinationPath('icon.png'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'assets/app_store_banner.png'), this.destinationPath('assets/app_store_banner.png'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'assets/app_store_icon.png'), this.destinationPath('assets/app_store_icon.png'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'LICENSE'), this.destinationPath('LICENSE'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'README.md'), this.destinationPath('README.md'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'test/Test.mpr'), this.destinationPath('test/Test.mpr'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'xsd/widget.xsd'), this.destinationPath('xsd/widget.xsd'));

      // Copy files based on WidgetName
      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/WidgetName/lib/jquery-1.11.2.js'),
        this.destinationPath('src/' + this.widget.widgetName + '/lib/jquery-1.11.2.js')
      );

      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/WidgetName/widget/template/WidgetName.html'),
        this.destinationPath('src/' + this.widget.widgetName + '/widget/template/' + this.widget.widgetName + '.html')
      );

      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/WidgetName/widget/ui/WidgetName.css'),
        this.destinationPath('src/' + this.widget.widgetName + '/widget/ui/' + this.widget.widgetName + '.css')
      );

      // Rename references in widget main JS
      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/WidgetName/widget/WidgetName.js'),
        this.destinationPath('src/' + this.widget.widgetName + '/widget/' + this.widget.widgetName + '.js'),
        {
          process: function (file) {
            var fileText = file.toString();
            fileText = fileText
                          .replace(/WidgetName\.widget\.WidgetName/g, this.widget.packageName + '.widget.' + this.widget.widgetName)
                          .replace(/WidgetName\/widget\/WidgetName/g, this.widget.packageName + '/widget/' + this.widget.widgetName)
                          .replace(/WidgetName/g, this.widget.widgetName)
                          .replace(/\{\{version\}\}/g, this.widget.version)
                          .replace(/\{\{date\}\}/g, this.widget.date)
                          .replace(/\{\{copyright\}\}/g, this.widget.copyright)
                          .replace(/\{\{license\}\}/g, this.widget.license)
                          .replace(/\{\{author\}\}/g, this.widget.author);
            return fileText;
          }.bind(this)
        }
      );

      // Rename references package.xml
      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/package.xml'),
        this.destinationPath('src/package.xml'),
        {
          process: function (file) {
            var fileText = file.toString();
            fileText = fileText
                          .replace(/WidgetName/g, this.widget.widgetName)
                          .replace(/\{\{version\}\}/g, this.widget.version);
            return fileText;
          }.bind(this)
        }
      );

      // Rename references WidgetName
      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/WidgetName/WidgetName.xml'),
        this.destinationPath('src/' + this.widget.widgetName + '/' + this.widget.widgetName + '.xml'),
        {
          process: function (file) {
            var fileText = file.toString();
            fileText = fileText
                          .replace(/WidgetName\.widget\.WidgetName/g, this.widget.packageName + '.widget.' + this.widget.widgetName)
                          .replace(/WidgetName/g, this.widget.widgetName);
            return fileText;
          }.bind(this)
        }
      );

      // Package.JSON
      this.template('_package.json', 'package.json', this.widget, {});

      // Add Gruntfile
      this.pkg = pkg;
      this.template('Gruntfile.js', 'Gruntfile.js', this, {});
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    }
  },

  install: function () {
    this.log('Copied files, now running ' + chalk.cyan('npm install') + ' to install development dependencies');
    this.npmInstall();
  }
});
