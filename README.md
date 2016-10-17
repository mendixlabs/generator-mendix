# generator-mendix [![Build Status](https://secure.travis-ci.org/mendix/generator-mendix.png?branch=master)](https://travis-ci.org/mendix/generator-mendix) [![npm version](https://badge.fury.io/js/generator-mendix.svg)](http://badge.fury.io/js/generator-mendix) [![DAVID](https://david-dm.org/mendix/generator-mendix.svg)](https://david-dm.org/mendix/generator-mendix) [![Development Dependency Status](https://david-dm.org/mendix/generator-mendix/dev-status.svg?theme=shields.io)](https://david-dm.org/mendix/generator-mendix#info=devDependencies)

[![NPM](https://nodei.co/npm/generator-mendix.svg?downloads=true&stars=true)](https://nodei.co/npm/generator-mendix/)

> [Yeoman](http://yeoman.io) generator for Mendix widgets.

## About

This generator uses the Yeoman scaffolding tool to let you quickly create a [Mendix widget](https://world.mendix.com/display/public/howto50/Custom+Widget+Development) based on the latest [AppStoreWidgetBoilerPlate](https://github.com/mendix/AppStoreWidgetBoilerplate). You can either use the full boilerplate with example code, or choose to use an empty widget.

If you want to see a short demo (this uses the older 1.x widget generator and only Grunt), please look at our [webinar](http://ww2.mendix.com/expert-webinar-developing-widgets.html)

---

## Prerequisites _(you only have to do this once)_

First, you need to have [Node.js](https://nodejs.org/en/) installed. (We recommend a 4.x LTS version, the widget is tested against version 4 to 6). After that, you need to install Yeoman and the Mendix Widget generator:

Open a command-line window (Press Win+R and type ``cmd`` or use Powershell)

```bash
  npm install -g yo generator-mendix
```

Make sure you have the latest version of ``yo``. The version we work with currently is 1.8.5 (which you can check by running ``yo --version``)

Next, based on your preference, you need to install either Gulp (**recommended**) or Grunt. Install this by typing:

```bash
  # If you want to use Gulp, run:

  npm install -g gulp-cli

  # If you want to use Grunt, run:

  npm install -g grunt-cli

```

---

## Scaffold a widget

### 1. Start the generator in the folder you want to create a widget

```bash
yo mendix
```

### 2. Provide the following information about your widget:

The following information needs to be provided about your widget:

* name
* description
* copyright
* license
* version
* author
* Github username (optional)

You can press \<Enter\> if you want to use the default values.

### 3.1. Which task runner do you want to use?

#### Gulp

The widget generator will include a **Gulpfile.js** and the necessary package.json for running Gulp tasks. We recommend using Gulp because of the speed.

#### Grunt

Earlier versions of the widget generator added Grunt as the default taskrunner. We included this option as well if you want to use this.

### 3.2. Which template do you want to use?

#### AppStoreWidgetBoilerplate

This uses the standard boilerplate which is on Github. This is recommended if you are a beginner. It includes example code with jQuery* and templates.

#### Empty widget

The empty widget will use a slim version of the AppStoreWidgetBoilerplate. It only provides the essential methods and setup. Furthermore, it will ask you if you want to use templates and jQuery*.

\* **We do not recommend using jQuery in your widgets, please [read this issue](https://github.com/mendix/AppStoreWidgetBoilerplate/issues/38). For simple DOM-manipulation you can use Dojo, which is provided by Mendix. Only use jQuery when you need it for certain external libraries that depend on it.**

---

## Use a taskrunner for development

The widget generator will scaffold a widget for you. It provides a convenient setup to develop you widget and publish it on Github. To make it even more easy, we add files for taskrunners.


### Gulp

The following tasks are provided in the **Gulpfile.js** and can be started by running ``gulp <TASKNAME>`` or ``npm run <TASKNAME>``:

* ``default``

You can omit this taskname and just run ``gulp``. This will watch for any changes in your ``src`` directory. If a change occurs, it will automatically create a new **MPK** and copy this to your ``widgets`` directory.

It will also copy any changed Javascript files to your deployment folder. This means you do not have to redeploy locally, you can just refresh your browser. For changes in ``XML`` or ``CSS`` you will still need to synchronize your project directory (press F4 in the modeler) and redeploy.

* ``modeler``

This will try to start the test-project that is included in the ``test`` folder. It automatically opens the Modeler with this project. If you have your test-project in a different location, you can change the following options in ``package.json``:

```json
  "paths": {
    "testProjectFolder": "./test/",
    "testProjectFileName": "Test.mpr"
  },
```

Note: If you provide a different path to the test-project in Windows, make sure you escape backslashes. So for example: ```C:\Projects\TestFolder``` needs to be properly written in the JSON as:

```json
    "testProjectFileName": "C:\\Projects\\TestFolder"
```

* ``version``

This task will show you the version number of the widget by reading the ``packages.xml`` file. You can set the version number with this task by typing:

``gulp version -n=X.X.X`` or ``npm run version -- -n=X.X.X``

* ``folders``

This will tell you which folders Gulp is using. You can change the folder of the test-project folder (See ``modeler`` task)

* ``build``

This will build the widget for you. It will output a new **MPK** file to both your ``dist`` folder, as well as the ``widgets`` folder in your test-project directory.

* ``icon``

This task will read the ``icon.png`` file (or any other image file if you provide the task a filename using ``gulp icon --file=<filename>``) and outputs a base64 string that you can use in your widget.xml.


### Grunt

The tasks that are provided by Gulp are also provided in the **Gruntfile.js**. The following tasks are configured:

* ``start-modeler`` : same as ``gulp modeler``
* ``build``
* ``version`` and ``version:X.X.X``
* ``folders``
* ``icon``*
* ``watch`` : is the same as ``gulp default``

\*This task can only read ``icon.png``, but it will automatically set the base64 string in your widget.xml for you.

---

## Use a taskrunner in an existing widget

* _My widget repository does not have a ``Gruntfile.js`` or ``Gulpfile.js``._

We thought about that. Make sure you open a command-line terminal in your widget repository. It needs at least the widget files in the ``src`` folder. By simply running the generator there, it will ask you if you want to install a taskrunner. It also needs two parameters (widget name and version number) that it tries to read from the package.xml and widget.xml

* _My widget repository contains a package.json and ``Gruntfile.js`` or ``Gulpfile.js``_

Great! If you have made sure you have Grunt/Gulp installed (See above, prerequisites), you can start using it. The only thing you need to do is install the dependencies for the different tasks. Run the same folder:

```bash
  npm install
```

Now you can use the Grunt/Gulp tasks as described.

---

## Troubleshooting

* _I get an error that it cannot find a dependency or local Grunt/Gulp._

Did you make sure you have the dependencies installed? Run ``npm install`` in your widget folder (it needs to have a package.json and **Gulpfile.js**/**Gruntfile.js**)

* _Some of the tasks cannot be found_

Check the version of your **Gruntfile.js**/**Gulpfile.js** (stated in the top of the file). The tasks described here are written for the 2.0 version of the widget generator. Any previous versions are outdated. If you run the widget generator in your widget folder again, it will update the file and dependencies for you.

* _I am getting weird errors_

Please report your issues [here](https://github.com/mendix/generator-mendix/issues). and we'll troubleshoot together with you.

---

## TODO:

* Add LICENSE files [request](https://github.com/mendix/generator-mendix/issues/19)
* Add JSHint (Grunt/Gulp)
* Add SASS support (add ``_sass`` folder that will output CSS to your src folder)

## Issues

Issues can be reported on [Github](https://github.com/mendix/generator-mendix/issues).
