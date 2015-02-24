Marionette.Toolkit
==================

[![Join the chat at https://gitter.im/RoundingWellOS/marionette.toolkit](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/RoundingWellOS/marionette.toolkit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Travis Status](http://img.shields.io/travis/RoundingWellOS/marionette.toolkit/master.svg?style=flat&amp;label=travis)](https://travis-ci.org/RoundingWellOS/marionette.toolkit) [![Code Climate Score](http://img.shields.io/codeclimate/github/RoundingWellOS/marionette.toolkit.svg?style=flat)](https://codeclimate.com/github/RoundingWellOS/marionette.toolkit) [![Coverage](http://img.shields.io/codeclimate/coverage/github/RoundingWellOS/marionette.toolkit.svg?style=flat)](https://codeclimate.com/github/RoundingWellOS/marionette.toolkit) [![Dependency Status](http://img.shields.io/david/RoundingWellOS/marionette.toolkit.svg?style=flat)](https://david-dm.org/RoundingWellOS/marionette.toolkit)


## About Marionette.Toolkit

Marionette.Toolkit is a collection of opinionated extensions for
[Marionette](http://marionettejs.com) Each element helps to reduce boilerplate
for complex large scale application problems.  This toolkit was
built from scripts open sourced from [RoundingWell.com](http://roundingwell.com).


## Documentation
  [StateClass](./docs/state-class.md) - `Marionette.Object` with a `Backbone.Model` for keeping state.

  [Component](./docs/component.md) - Reusable `StateClass` with `View` management boilerplate

  [AbstractApp](./docs/abstract-app.md) - Object including a start/stop lifecycle and running event registry.

  [App](./docs/app.md) - `AbstractApp` with mixed in "App Manager" for adding and removing child `App`s


## Getting Help

If you have questions or concerns please feel free to [open an issue](#github-issues).
Additionally join us on the [Marionette Gitter](https://gitter.im/marionettejs/backbone.marionette) to have a chat.
Everyone there is happy to discuss design patterns.


## Project Details

#### Library Downloads

You can download the latest builds directly from the [dist](https://github.com/RoundingWellOS/marionette.toolkit/tree/master/dist) folder above.

#### Available Packages

Marionette.Toolkit is not yet available via package manager, but will
soon be released via npm.  If you would like another channel, please
[open an issue](#github-issues).

#### Changelog

For change logs and release notes, see the [changelog](CHANGELOG.md) file.

#### Compatibility and Requirements

Marionette.Toolkit currently requires [Marionette](http://marionettejs.com) 2.1.0+ as it extends
[`Marionette.Object`](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.object.md)

It's possible this library would work with earlier versions by shiming
`Marionette.Object = Marionette.Controller;`

This library is currently only tested with the latest version of Marionette.


## How to Contribute

If you would like to contribute to Marionette.Toolkit's source code, please read
the [guidelines for pull requests and contributions](CONTRIBUTING.md).
Following these guidelines will help make your contributions easier to
bring into the next release.

### Github Issues

[Report issues](https://github.com/RoundingWellOS/marionette.toolkit/issues) with Marionette.Toolkit, [submit pull requests](https://github.com/RoundingWellOS/marionette.toolkit/pulls) to fix problems, or to
create summarized and documented feature requests (preferably with pull
requests that implement the feature).


===

This library is © 2015 RoundingWell. Distributed under MIT license.
