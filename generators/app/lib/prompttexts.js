/*jshint -W108,-W069*/
"use strict";
var semver = require('semver');

function promptsNew () {
  return [
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
      type: 'list',
      name: 'builder',
      message: 'Which task runner do you want to use for development?',
      choices: [{
          name: 'Gulp (recommended)',
          value: 'gulp'
        },{
          name: 'Grunt',
          value: 'grunt'
        }
      ],
      default: 0
    },
    /*{
      // NOT IMPLEMENTED YET
      type: 'confirm',
      name: 'useSass',
      message: 'Do you want to use SASS? (will add _sass folder)',
      default: false,
      store: true,
      when: function (props) {
        return props.builder === 'gulp';
      },
      store: true
    },*/
    {
      type: 'list',
      name: 'boilerplate',
      message: 'Which template do you want to use for the widget?',
      choices: [{
          name: 'AppStoreWidgetBoilerplate, from Github (recommended for beginners)',
          value: 'appstore'
        },{
          name: 'Empty widget (recommended for more experienced developers)',
          value: 'empty'
        }
      ],
      store: true
    },{
      type: 'checkbox',
      name: 'widgetoptions',
      message: 'Which of the following things apply?',
      choices: [{
          name: 'Use templates (add template mixin and template.html)',
          value: 'templates',
          checked: false
        },{
          name: 'Use jQuery (not recommended, only use it if external libraries need it)',
          value: 'jquery',
          checked: false
        }/*
        // NOT IMPLEMENTED YET,{
          name: 'Add Execute Microflow shorthand',
          value: 'execMf',
          checked: false
        },{
          name: 'Add validation (will add an attribute property and example methods, will use templates)',
          value: 'validation',
          checked: false
        }
        */
      ],
      when: function (props) {
        return props.boilerplate === 'empty';
      },
      store: true
    }
  ];
}

function promptsUpgrade (current) {
  return [
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
      message: 'What is name of your widget? (Do not change this, unless you know what you are doing)',
      default: current.name,
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
      default: current.version,
      when: function (props) {
        return props.upgrade;
      }
    },{
      type: 'list',
      name: 'builder',
      message: 'Which build script do you want to use? (This will remove old Gruntfile/Gulpfile)',
      choices: [{
          name: 'Gulp (recommended)',
          value: 'gulp'
        },{
          name: 'Grunt',
          value: 'grunt'
        }
      ],
      default: 0
    }
  ];
}

module.exports = {
  promptsNew: promptsNew,
  promptsUpgrade: promptsUpgrade
};
