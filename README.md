Marionette.Toolkit
==================

[![Travis Status](http://img.shields.io/travis/RoundingWellOS/marionette.toolkit/master.svg?style=flat&amp;label=travis)](https://travis-ci.org/RoundingWellOS/marionette.toolkit) [![Code Climate Score](http://img.shields.io/codeclimate/github/RoundingWellOS/marionette.toolkit.svg?style=flat)](https://codeclimate.com/github/RoundingWellOS/marionette.toolkit) [![Coverage](http://img.shields.io/codeclimate/coverage/github/RoundingWellOS/marionette.toolkit.svg?style=flat)](https://codeclimate.com/github/RoundingWellOS/marionette.toolkit) [![Dependency Status](http://img.shields.io/david/RoundingWellOS/marionette.toolkit.svg?style=flat)](https://david-dm.org/RoundingWellOS/marionette.toolkit)


## About Marionette.Toolkit

Marionette.Toolkit is a collection of opinionated extensions for
[Marionette](http://marionettejs.com) Each element helps to reduce boilerplate
for complex large scale application problems.  This toolkit was
built from scripts open sourced from [RoundingWell.com](http://roundingwell.com).

## Documentation
  [App](./docs/app.md) - An extension of `Marionette.Application`. Its purpose is to provide an object with a `initialize`/`start`/`stop`/`destroy` lifecycle.

  [Component](./docs/component.md) - An extension of `Marionette.Object`. Provides a consistent interface for which to package state-view-logic.

  [Asnyc App start](./docs/async-app-start.md) - How to easily start apps asynchronously.

  [StateMixin](./docs/mixins/state.md) - JavaScript Object with a `Backbone.Model` for keeping state.  Used by both the App and Component but can be applied to any Marionette Class.

  [ChildAppsMixin](./docs/mixins/child-apps.md) - Functionality to add or remove child Apps to a parent App, start apps asynchronously, and connect the child App lifecycle with the parent App lifecycle.

  [EventListenersMixin](./docs/mixins/event-listeners.md) - Binds events to the `App` while running and removed (and only those) when the `App` is stopped.


## Getting Help

If you have questions or concerns please feel free to [open an issue](#github-issues).
Additionally join us on the [Marionette Gitter](https://gitter.im/marionettejs/backbone.marionette) to have a chat.
Everyone there is happy to discuss design patterns.


## Project Details

#### Library Downloads

You can download the latest builds directly from the [dist](https://github.com/RoundingWellOS/marionette.toolkit/tree/master/dist) folder above.

#### Available Packages

**Via [npm](https://www.npmjs.com/package/marionette.toolkit)**
```
$ npm install marionette.toolkit
```

**Via [bower](http://bower.io/search/?q=marionette.toolkit)**
```
$ bower install marionette.toolkit
```


Currently Marionette.Toolkit is available via npm and bower. If you would like add it to another channel, please
[open an issue](#github-issues).

#### Changelog

For change logs and release notes, see the [changelog](CHANGELOG.md) file.

#### Compatibility and Requirements

Marionette.Toolkit currently requires [Marionette](http://marionettejs.com) 3.0.0+ as it utilizes [`Marionette.Error`](https://github.com/marionettejs/backbone.marionette/blob/v2.2.0/src/marionette.error.js) and extends
[`Marionette.Application`](https://github.com/marionettejs/backbone.marionette/blob/next/docs/marionette.application.md)

This library is tested with Marionette v3.0+

Marionette.Toolkit supports IE9+ and modern browsers.


## How to Contribute

If you would like to contribute to Marionette.Toolkit's source code, please read
the [guidelines for pull requests and contributions](CONTRIBUTING.md).
Following these guidelines will help make your contributions easier to
bring into the next release.

You can also join us in the [Marionette Toolkit Gitter](https://gitter.im/RoundingWellOS/marionette.toolkit) to think up new features, report bugs, ask questions, and talk design patterns within Toolkit.

### Github Issues

[Report issues](https://github.com/RoundingWellOS/marionette.toolkit/issues) with Marionette.Toolkit, and [submit pull requests](https://github.com/RoundingWellOS/marionette.toolkit/pulls) to fix problems or to
create summarized and documented feature requests (preferably with the feature implemented in the pull request).


===

This library is © 2016 RoundingWell. Distributed under MIT license.
