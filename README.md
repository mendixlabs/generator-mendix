# generator-mendix [![Build Status](https://secure.travis-ci.org/mendix/generator-mendix.png?branch=master)](https://travis-ci.org/mendix/generator-mendix) [![npm version](https://badge.fury.io/js/generator-mendix.svg)](http://badge.fury.io/js/generator-mendix) [![DAVID](https://david-dm.org/mendix/generator-mendix.svg)](https://david-dm.org/mendix/generator-mendix) [![Development Dependency Status](https://david-dm.org/mendix/generator-mendix/dev-status.svg?theme=shields.io)](https://david-dm.org/mendix/generator-mendix#info=devDependencies)

[![NPM](https://nodei.co/npm/generator-mendix.svg?downloads=true&stars=true)](https://nodei.co/npm/generator-mendix/)

> [Yeoman](http://yeoman.io) generator for Mendix widgets.

## About

This generator uses the Yeoman scaffolding tool to let you quickly create a [Mendix widget](https://world.mendix.com/display/public/howto50/Custom+Widget+Development) based on the latest [AppStoreWidgetBoilerPlate](https://github.com/mendix/AppStoreWidgetBoilerplate).

### Prerequisites (you only have to do this ONCE)

First, you need to have NodeJs installed. After that, you need to install Yeoman, Mendix Widget generator and Grunt:

```bash
npm install -g yo generator-mendix grunt-cli
```

Make sure you have the latest version of ``yo``. The version we work with currently is 1.8.3 (which you can check by running ``yo --version``)

### Usage

##### 1.) Start the generator in the folder you want to create a widget:

```bash
yo mendix
```

##### 2.) The generator will ask you to provide the following information about your widget:

* name
* description
* copyright
* license
* version
* author
* Github username (optional)

##### 3.) Your widget will be created using the options and the boilerplate.

It will clone the boilerplate, rename your widget according to the options. It also includes a ``Gruntfile.js`` and ``package.json`` for development purposes (see below)

### Grunt

The generator will include Grunt to automate your widget development. [Make sure you have Grunt installed](http://gruntjs.com/getting-started).

The following Grunt tasks can be started by typing ``grunt <TASKNAME>``:

* ``start-modeler``

This will try to open the Modeler using the included test-project. (Older versions of the Gruntfile will use ``grunt start-mendix``)

* ``watch`` (this is actually an alias for default, so you can run ``grunt`` without adding this taskname)

This watches for changes in your ``src`` folder. When a file is changed, it copies the change to the deployment-folder (so you do not have to restart your project when changing files **(with the exception of ``.xml`` files)**). It also automatically creates a ``.mpk`` file in your ``/dist`` and ``test/widgets`` folder.

* ``version``

This will let you set the version of your widget, the ``package.xml``, without editing it yourself.

* ``folders``

Grunt uses the settings in package.json to determine which folders it uses. If, for example, you use this to develop a widget in your project, you can change the folder in package.json:

```json
...
    "testProjectFolder": "./test/",
...
```

and then check if the path is correct by running the ``grunt folders`` task

* ``build``

Cleans old ``.mpk`` files and creates a new one in your ``/dist`` and ``test/widgets`` folder

* ``csslint``

Lints through all CSS files that are in the ``widget/ui`` folder and checks for errors

### Using Grunt in a widget respository/project you downloaded.

If you download or clone one of our repositories that has a ``Gruntfile.js`` and ``package.json`` included, you need to install the dependencies first to be able to run Grunt:

1. Make sure you open the root folder in your command-line/terminal window
2. Run ``npm install`` to install the dependencies
3. Now you can use the Grunt tasks as described in the previous point

### Grunt can be started from command-line, or used by Grunt-plugins for different IDE's:

* [WebStorm](https://www.jetbrains.com/webstorm/help/using-grunt-task-runner.html)
* [Brackets](https://github.com/dhategan/brackets-grunt)
* Visual Studio Code (has [built-in support for Grunt & Gulp](https://code.visualstudio.com/Docs/editor/tasks))
* [Sublime Text](https://github.com/tvooo/sublime-grunt)
* NetBeans (has [built-in support for Grunt](https://blogs.oracle.com/geertjan/entry/grunting_in_netbeans_ide))

## TODO:

* Gulp integration
* Add JSHint (Grunt/Gulp)

## Troubleshooting



## Issues

Issues can be reported on [Github](https://github.com/mendix/generator-mendix/issues).
