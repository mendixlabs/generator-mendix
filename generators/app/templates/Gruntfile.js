// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %> :: http://github.com/<%= pkg.repository %>
'use strict';

module.exports = function (grunt) {
  var pkg = grunt.file.readJSON("package.json");
  grunt.verbose;
  grunt.initConfig({
    watch: {
      autoDeployUpdate: {
        "files": ["./src/**/*"],
        "tasks": ["newer:copy", "compress"],
        options: {
          debounceDelay: 250,
          livereload: true
        }
      }
    },
    compress: {
      makezip: {
        options: {
          archive: "./dist/" + pkg.name + ".mpk",
          mode: "zip"
        },
        files: [{
            expand: true,
            date: new Date(),
            store: false,
            cwd: "./src",
            src: ["**/*"]
          }]
      }
    },
    copy: {
      deployment: {
        files: [
          {dest: "./test/deployment/web/widgets", cwd: "./src/", src: ["**/*"], expand: true}//,
          //{dest: "./test/Mx5.20/deployment/web/widgets", cwd: "./src/", src: ["**/*"], expand: true}
        ]
      },
      mpks: {
        files: [
          {dest: "./test/widgets", cwd: "./dist/", src: [ pkg.name + ".mpk"], expand: true}//,
          //{dest: "./test/Mx5.20/widgets", cwd: "./dist/", src: [ pkg.name + ".mpk"], expand: true}
        ]
      }
    },
    clean: {
      build: [
          "./dist/" + pkg.name + "/*",
          "./test/deployment/web/widgets/" + pkg.name + "/*",
          "./test/widgets/" + pkg.name + ".mpk"/*,
          "./test/Mx5.20/deployment/web/widgets/" + pkg.name + "/*",
          "./test/Mx5.20/widgets/" + pkg.name + ".mpk"*/
        ]            
    }
  });
  
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-newer");

  grunt.registerTask("default", ["watch"]);

  grunt.registerTask(
      "clean build",
      "Compiles all the assets and copies the files to the build directory.", ["clean","compress", "copy" ]
      );
  grunt.registerTask("build", ["clean build"]);
};