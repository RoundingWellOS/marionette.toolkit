# Marionette.Toolkit.App

`Marionette.Toolkit.App` is an extention of [`Marionette.Toolkit.AbstractApp`](./abstract-app.md).  An `AbstractApp`'s purpose is to provide an object with a `initialize`/`start`/`stop`/`destroy` lifecycle.  All events bound to the `AbstractApp` while running (and only those) will be removed when stopped.  `App` mixes in "App Manager" functionality so that child `App`s can be added or removed relating the child `App` lifecycle with the parent `App` lifecycle.
