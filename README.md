Marionette.Toolkit
==================

[![Travis Status](http://img.shields.io/travis/RoundingWellOS/marionette.toolkit/master.svg?style=flat&amp;label=travis)](https://travis-ci.org/RoundingWellOS/marionette.toolkit) [![Test Coverage](https://api.codeclimate.com/v1/badges/a3e249a26dd7871a0262/test_coverage)](https://codeclimate.com/github/RoundingWellOS/marionette.toolkit/test_coverage)


## About Marionette.Toolkit

Marionette.Toolkit is a collection of opinionated extensions for
[Marionette](http://marionettejs.com) Each element helps to reduce boilerplate
for complex large scale application problems.  This toolkit was
built from scripts open sourced from [RoundingWell.com](http://roundingwell.com).

## Documentation
  [App](./docs/app.md) - An extension of `Marionette.Application`. Its purpose is to provide an object with a `initialize`/`start`/`stop`/`destroy` lifecycle.

  [Component](./docs/component.md) - An extension of `Marionette.Application`. Provides a consistent interface for which to package state-view-logic.

  [Async App start](./docs/async-app-start.md) - How to easily start apps asynchronously.

  [StateMixin](./docs/mixins/state.md) - JavaScript Object with a `Backbone.Model` for keeping state.  Used by both the App and Component but can be applied to any Marionette Class.

  [ChildAppsMixin](./docs/mixins/child-apps.md) - Functionality to add or remove child Apps to a parent App, start apps asynchronously, and connect the child App lifecycle with the parent App lifecycle.

  [EventListenersMixin](./docs/mixins/event-listeners.md) - Binds events to the `App` while running and removed (and only those) when the `App` is stopped.

  [ViewEventsMixin](./docs/mixins/view-events.md) - Adds `Marionette.View`-like support for view event proxying. The API is analogous to `childViewEventPrefix`, `childViewEvents` and `childViewTriggers`.


## Getting Help

If you have questions or concerns please feel free to [open an issue](#github-issues).
Additionally join us on the [Marionette Gitter](https://gitter.im/marionettejs/backbone.marionette) to have a chat.
Everyone there is happy to discuss design patterns.


## Project Details

#### Library Downloads

You can download the latest builds directly from the [dist](https://github.com/RoundingWellOS/marionette.toolkit/tree/master/dist) folder above.

#### Available Packages

**Via [yarn](https://www.npmjs.com/package/marionette.toolkit)**
```
$ yarn add marionette.toolkit
```

**Via [npm](https://www.npmjs.com/package/marionette.toolkit)**
```
$ npm install marionette.toolkit
```


Currently Marionette.Toolkit is available via npm and bower. If you would like add it to another channel, please
[open an issue](#github-issues).

#### Changelog

For change logs and release notes, see the [changelog](CHANGELOG.md) file.

#### Compatibility and Requirements

Marionette.Toolkit currently requires and is tested with [Marionette](http://marionettejs.com) 3.0.0+ as it extends
[`Marionette.Application`](https://github.com/marionettejs/backbone.marionette/blob/next/docs/marionette.application.md)

Marionette.Toolkit supports IE10+ and modern browsers.


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

This library is © 2019 RoundingWell. Distributed under MIT license.
