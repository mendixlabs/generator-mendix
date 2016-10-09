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
      message: 'Which build script do you want to use?',
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
