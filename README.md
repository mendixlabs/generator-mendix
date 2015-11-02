# generator-mendix [![Build Status](https://secure.travis-ci.org/JelteMX/generator-mendix.png?branch=master)](https://travis-ci.org/JelteMX/generator-mendix)

> [Yeoman](http://yeoman.io) generator for Mendix widgets.

## About

This generator uses the Yeoman scaffolding tool to let you quickly create a [Mendix widget](https://world.mendix.com/display/public/howto50/Custom+Widget+Development) based on the latest [AppStoreWidgetBoilerPlate](https://github.com/mendix/AppStoreWidgetBoilerplate).

### Prerequisites

First, you need to have NodeJs installed. After that, you need Yeoman and the generator

```bash
npm install -g yo generator-mendix
```

### Use the generator

#####1.) Start the generator:

```bash
yo mendix
```

#####2.) This will show you the following screen:

--> add image <--

The following options are asked:

* name
* package
* description
* copyright
* license
* version
* author
* Github username (optional)

The default value is shown between ``(`` ``)``

#####3.) Now your widget will be created using the options and the boilerplate.

It will clone the boilerplate, rename your widget according to the options. It also includes a ``Gruntfile.js`` and ``package.json`` for development purposes (see below)

### Grunt

The generator will include Grunt as well. This will make it possible to automate your widget development. The following Grunt tasks are implemented:

* ``start-mendix``

This will try to open the Modeler using the included test-project.

* ``watch`` (alias for default, just run ``grunt``)

This watches for changes in your ``src`` folder. When a file is changed, it copies the change to the deployment-folder (so you do not have to restart your project when changing files **(with the exception of ``.xml`` files)**). It also automatically creates a ``.mpk`` file in your ``/dist`` and ``test/widgets`` folder.

* ``build``

Cleans old ``.mpk`` files and creates a new one in your ``/dist`` folder

#####Grunt can be started from command-line, or used by Grunt-plugins for different IDE's:

* [WebStorm](https://www.jetbrains.com/webstorm/help/using-grunt-task-runner.html)
* [Brackets](https://github.com/dhategan/brackets-grunt) 
* Visual Studio Code (has [built-in support for Grunt & Gulp](https://code.visualstudio.com/Docs/editor/tasks))
* [Sublime Text](https://github.com/tvooo/sublime-grunt)
* NetBeans (has [built-in support for Grunt](https://blogs.oracle.com/geertjan/entry/grunting_in_netbeans_ide))

## TODO:

* Gulp integration
* Add JSHint (Grunt/Gulp) or ESLint (advantage of checking the AST for deprecated client API's)
* Add Analytics
* Check for updates
* Move package.json & Gruntfile.js to Boilerplate

## Issues

Issues can be reported on [Github](https://github.com/JelteMX/generator-mendix/issues).

## License

Apache 2
