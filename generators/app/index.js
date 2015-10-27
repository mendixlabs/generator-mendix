'use strict';

var packagejs = require(__dirname + '/../../package.json');
var html = require("html-wiring");
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var path = require('path');
var yosay = require('yosay');

var boilerPlatePath = '/AppStoreWidgetBoilerplate/';

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('skip-install', {
      desc:     'Whether dependencies should be installed',
      defaults: false
    });

    this.option('skip-install-message', {
      desc:     'Whether commands run should be shown',
      defaults: false
    });

    //this.sourceRoot(path.join(path.dirname(this.resolved), 'templates/AppStoreWidgetBoilerplate'));
  },
  prompting: function () {
    var done = this.async(),
        questions = 15;

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Mendix') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'widgetName',
        validate: function (input) {
          if (/^([a-zA-Z]*)$/.test(input)) return true;
          return 'Your widget name cannot contain special characters or a blank space, using the default name instead (use Ctrl+C to abort)';
        },
        message: 'What is name of your widget?',
        default: 'MyWidget'
      },{
        type: 'input',
        name: 'packageName',
        validate: function (input) {
          if (/^([a-zA-Z]*)$/.test(input)) return true;
          return 'Your package name cannot contain special characters or a blank space, using the default name instead (use Ctrl+C to abort)';
        },
        message: 'What is name of your package?',
        default: 'MyPackage'
      },{
        type: 'input',
        name: 'description',
        message: 'Enter a description for your widget',
        default: 'My brand new Mendix widget',
        store: true
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
          if (/^([0-9\.]*)$/.test(input)) return true;
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
        message: 'Github username',
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
      this.widget.packageName = this.props.packageName;
      this.widget.description = this.props.description;
      this.widget.version = this.props.version; 
      this.widget.author = this.props.author;
      this.widget.date = (new Date()).toLocaleDateString();
      this.widget.copyright = this.props.copyright;
      this.widget.license = this.props.license;
      this.widget.github = this.props.github !== '<none>' ? 'http://github.com/' + this.props.github + '/' + this.widget.widgetName : false;

      // Using grunt (future version will include Gulp)
      this.widget.builder = 'grunt';

      // Copy generic files
      this.fs.copy(this.templatePath(boilerPlatePath + '.jshintrc'), this.destinationPath('.jshintrc'));
      this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
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
            fileText = fileText.replace(/WidgetName/g, this.widget.widgetName);
            return fileText;
          }.bind(this)
        }
      );

      // Package.JSON
      this.template('_package.json', 'package.json', this.widget, {});

      // Add Gruntfile
      this.pkg = JSON.parse(html.readFileAsString(path.join(__dirname, '../../package.json')));

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
