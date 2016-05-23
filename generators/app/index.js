/*jshint -W108,-W069*/
'use strict';

var pkg = require(__dirname + '/../../package.json');
var semver = require('semver');
var fs = require('fs');
var extfs = require('extfs');
var xml2js = require("xml2js");
var parser = new xml2js.Parser();
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var boilerPlatePath = 'AppStoreWidgetBoilerplate/';

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

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    var done = this.async();
    this.isNew = true;

    this.folders = extfs.getDirsSync(this.destinationRoot());
    this.current = {};
    this.current.version = '1.0.0';
    this.current.name = 'CurrentWidget';

    if (this.folders.indexOf('src') !== -1) {
      var srcFolderContent = extfs.getDirsSync(this.destinationPath('src'));
      if (srcFolderContent.length === 1) {
        this.current.name = srcFolderContent[0];
      }
      if (!extfs.isEmptySync(this.destinationPath('package.json'))) {
        try {
          var destPkg = JSON.parse(fs.readFileSync(this.destinationPath('package.json')).toString());
          this.current.description = destPkg.description;
          this.current.author = destPkg.author;
          this.current.copyright = destPkg.copyright;
          this.current.license = destPkg.license;
          this.current.repository = destPkg.repository ? JSON.stringify(destPkg.repository) : false;
        } catch (e) {}
      }
      if (!extfs.isEmptySync(this.destinationPath('src/package.xml'))) {
        this.isNew = false;
        var pkgXml = fs.readFileSync(this.destinationPath('src/package.xml')).toString();
        parser.parseString(pkgXml, function (err, result) {
          if (err) {
            this.log('Error: ' + err);
            process.exit(0);
          }
          if (result.package.clientModule[0]["$"]["version"]) {
            var version = result.package.clientModule[0]["$"]["version"];
            if (version.split(".").length === 2) {
              version += ".0";
            }
            this.current.version = version;
          }
          done();
        }.bind(this));
      } else {
        this.isNew = false;
        done();
      }
    } else if (!extfs.isEmptySync(this.destinationRoot())) {
      this.isNew = false;
      done();
    } else {
      done();
    }
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(banner);

    var promptsNew = [
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
        default: '<Your Company> 2016',
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

    var promptsUpgrade = [
      {
        type: 'confirm',
        name: 'upgrade',
        message: 'Are you upgrading a custom widget? (Need \'src\' folder to work)',
        default: false
      },{
        type: 'input',
        name: 'widgetName',
        validate: function (input) {
          if (/^([a-zA-Z]*)$/.test(input)) { return true; }
          return 'Your widget can only contain letters (a-z & A-Z). Please provide a valid name';
        },
        message: 'What is name of your widget? (Please make it the same as your current MPK file, e.g. "CustomWidget.mpk", name is "CustomWidget")',
        default: this.current.name,
        when: function (props) {
          return props.upgrade;
        }
      },{
        type: 'input',
        name: 'version',
        validate: function (input) {
          if (semver.valid(input) && semver.satisfies(input, '>=1.0.0')) {
            return true;
          }
          return 'Your version needs to be formatted as x.x.x and starts at 1.0.0. Using 1.0.0';
        },
        message: 'Enter your current version (package.xml) or the default version',
        default: this.current.version,
        when: function (props) {
          return props.upgrade;
        }
      }
    ];

    if (this.isNew) {
      this
        .prompt(promptsNew)
        .then(function (props) {
          this.props = props;
          // To access props later use this.props.someOption;
          done();
        }.bind(this));
    } else {
      this.log(chalk.bold.red(' The directory is not empty. If you are creating a new widget, please open the generator in an empty folder (Press Ctrl+C to abort)\n\n'));
      this
        .prompt(promptsUpgrade)
        .then(function (props) {
          this.props = props;
          if (!props.upgrade) {
            process.exit(0);
          } else {
            done();
          }
        }.bind(this));
    }

  },

  writing: {
    app: function () {
      // Define widget variables
      this.widget = {};
      this.widget.widgetName = this.props.widgetName;
      this.widget.packageName = this.props.widgetName;
      this.widget.description = this.props.description || this.current.description;
      this.widget.version = this.props.version;
      this.widget.author = this.props.author || this.current.author;
      this.widget.date = (new Date()).toLocaleDateString();
      this.widget.copyright = this.props.copyright || this.current.copyright;
      this.widget.license = this.props.license || this.current.license;
      this.widget.generatorVersion = pkg.version;
      this.widget.github = (this.props.github !== '<none>' && typeof this.props.github !== 'undefined') ? '"http://github.com/' + this.props.github + '/' + this.widget.widgetName + '"' : false;
      this.widget.repository = this.current.repository ||  false;

      // Using grunt (future version will include Gulp)
      this.widget.builder = 'grunt';

      if (this.isNew) {
        // Copy generic files
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
      }

      // Gitignore
      this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));

      // jshint
      this.fs.copy(this.templatePath(boilerPlatePath + '.jshintrc'), this.destinationPath('.jshintrc'));

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
  },

  end: function () {
    this.log('\n\n> I will now run ' + chalk.cyan('grunt build') + ' to build the mpk (do this before starting the modeler)< \n\n');
    this.spawnCommand('grunt', ['build']);
  }
});
