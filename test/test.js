/*jshint -W108,-W069*/
require('./lib/testrunner-appstore-boilerplate.js')('gulp');
require('./lib/testrunner-appstore-boilerplate.js')('grunt');
require('./tests/not-empty-dir.js');

require('./lib/testrunner-appstore-empty.js')('gulp', {
  boilerplate: 'empty',
  widgetoptions: ['templates', 'jquery']
});
require('./lib/testrunner-appstore-empty.js')('gulp', {
  boilerplate: 'empty',
  widgetoptions: ['templates']
});
require('./lib/testrunner-appstore-empty.js')('gulp', {
  boilerplate: 'empty',
  widgetoptions: ['jquery']
});
require('./lib/testrunner-appstore-empty.js')('gulp', {
  boilerplate: 'empty',
  widgetoptions: []
});
