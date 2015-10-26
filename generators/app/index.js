'use strict';
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
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Mendix') + ' generator!'
    ));

    // var prompts = [{
    //   type: 'confirm',
    //   name: 'someOption',
    //   message: 'Would you like to enable this option?',
    //   default: true
    // }];

    // this.prompt(prompts, function (props) {
    //   this.props = props;
    //   // To access props later use this.props.someOption;

    //   done();
    // }.bind(this));
    done();
  },

  writing: {
    app: function () {

      var widgetName = 'TestWidget';
      var packageName = 'Test';
      var description = 'Let\'s give our widget a description'
      var version = '1.0.0'; 
      var author = 'Author';
      var date = 'Date';
      var copyright = 'CopyRight';
      var license = 'Apache 2';

      // Copy generic files
      this.fs.copy(this.templatePath(boilerPlatePath + '.jshintrc'), this.destinationPath('.jshintrc'));
      this.fs.copy(this.templatePath(boilerPlatePath + '.gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'assets/app_store_banner.png'), this.destinationPath('assets/app_store_banner.png'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'assets/app_store_icon.png'), this.destinationPath('assets/app_store_icon.png'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'LICENSE'), this.destinationPath('LICENSE'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'README.md'), this.destinationPath('README.md'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'test/Test.mpr'), this.destinationPath('test/Test.mpr'));
      this.fs.copy(this.templatePath(boilerPlatePath + 'xsd/widget.xsd'), this.destinationPath('xsd/widget.xsd'));

      // Copy files based on WidgetName
      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/WidgetName/lib/jquery-1.11.2.js'), 
        this.destinationPath('src/' + widgetName + '/lib/jquery-1.11.2.js')
      );

      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/WidgetName/widget/template/WidgetName.html'), 
        this.destinationPath('src/' + widgetName + '/widget/template/' + widgetName + '.html')
      );

      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/WidgetName/widget/ui/WidgetName.css'), 
        this.destinationPath('src/' + widgetName + '/widget/ui/' + widgetName + '.css')
      );

      // Rename references in widget main JS
      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/WidgetName/widget/WidgetName.js'), 
        this.destinationPath('src/' + widgetName + '/widget/' + widgetName + '.js'),
        {
          process: function (file) {
            var fileText = file.toString();
            fileText = fileText
                          .replace(/WidgetName\.widget\.WidgetName/g, packageName + '.widget.' + widgetName)
                          .replace(/WidgetName\/widget\/WidgetName/g, packageName + '/widget/' + widgetName)
                          .replace(/WidgetName/g, widgetName)
                          .replace(/\{\{version\}\}/g, version)
                          .replace(/\{\{date\}\}/g, date)
                          .replace(/\{\{copyright\}\}/g, copyright)
                          .replace(/\{\{license\}\}/g, license)
                          .replace(/\{\{author\}\}/g, author);

            console.log(fileText);
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
                          .replace(/WidgetName/g, widgetName)
                          .replace(/\{\{version\}\}/g, version);

            console.log(fileText);
            return fileText;
          }.bind(this)
        }
      );

      // Rename references WidgetName
      this.fs.copy(
        this.templatePath(boilerPlatePath + 'src/WidgetName/WidgetName.xml'), 
        this.destinationPath('src/' + widgetName + '/' + widgetName + '.xml'),
        {
          process: function (file) {
            var fileText = file.toString();
            fileText = fileText.replace(/WidgetName/g, widgetName);
            
            console.log(fileText);
            return fileText;
          }.bind(this)
        }
      );

      // Package.JSON
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
