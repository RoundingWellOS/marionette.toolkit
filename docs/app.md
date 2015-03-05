# Marionette.Toolkit.App

`Marionette.Toolkit.App` is an extention of [`Marionette.Toolkit.AbstractApp`](./abstract-app.md).  An `AbstractApp`'s purpose is to provide an object with a `initialize`/`start`/`stop`/`destroy` lifecycle.  All events bound to the `AbstractApp` while running (and only those) will be removed when stopped.  `App` mixes in "App Manager" functionality so that child `App`s can be added or removed relating the child `App` lifecycle with the parent `App` lifecycle.

## Documentation Index
* [App's Lifecycle Settings](#apps-lifecycle-settings)
* [App's `childApps`](#apps-childapps)
* [App API](#app-api)
  * [App `buildApp`](#app-buildapp)
  * [App `addChildApp`](#app-addchildapp)
  * [App `addChildApps`](#app-addchildapps)
  * [App `getChildApp`](#app-getchildapp)
  * [App `getChildApps`](#app-getchildapps)
  * [App `removeChildApp`](#app-removechildapp)
  * [App `removeChildApps`](#app-removechildapps)
  * [App `removeChildApp`](#app-removechildapp)

## App's Lifecycle Settings

`childApp` lifecycles may be determined by the settings applied to a `childApp` itself.  For more information read [AbstractApp Lifecycle Settings](./abstract-app.md#lifecycle-settings)

### App's `childApps`
`childApps` is an object literal or a function that returns an object literal.
The object literal must contain app names as keys and app definitions as values.
`childApps` can be passed to an `App` at instantiation or defined on the definition.

```js
var MyApp = Marionette.Toolkit.App.extend({
  childApps: function(){
    return {
      childName: MyChildApp,
      otherName: {
        AppClass: MyOtherApp,
        preventDestroy: true,
        fooOption: 'bar'
      }
    };
  }
});
```

```js
var myApp = new Marionette.Toolkit.App({
  childApps: {
    childName: MyChildApp,
    otherName: {
      AppClass: MyOtherApp,
      preventDestroy: true,
      fooOption: 'bar'
    }
  }
});
```

## App API

### App `buildApp`
Child instances are built through this function.
Override it if a parent app has additional concerns when building its children.

```js
buildApp: function(AppClass, options) {
  return new AppClass(options);
}
```

### App `addChildApp`

`App`s can be added as children of an `App` individually using
the `addChildApp` method. This method takes three parameters: the app name,
the app definition and options to pass to the app when built.
The returned value is the add childApp instance.

```js
var myApp = new Marionette.Toolkit.App();

var myChildApp = myApp.addChildApp('foo', Marionette.Toolkit.App, { fooOption: true });

myChildApp.getOption('fooOption'); // => true
```

In this example, a child app named "foo" will be added
to the myApp instance.

There are a lot of other ways to define an app,
including object literals with various options and
a function returning an object literal. For more information
on this, see [App's `childApps`](#apps-childapps).

### App `addChildApps`

`App`s can also be added en-masse through the use
of the `addChildApps` method. This method takes an object
literal or a function that returns an object literal.
The object literal must contain app names as keys
and app definitions as values.

```js
var myApp = new Marionette.Toolkit.App();

// With an object literal
myApp.addChildApps({
  main: Marionette.Toolkit.App,
  navigation: {
    fooOption: true,
    startWithParent: true,
    AppClass: MyNavApp
  }
});

// With a function
myApp.addChildApps(function() {
  return {
    footer: Marionette.Toolkit.App
  };
});

myApp.getChildApp('main');        //=> 'main' app instance
var navApp = myApp.getChildApp('navigation');  //=> 'navigation' app instance
navApp.getOption('fooOption'); //=> true
myApp.getChildApp('footer'); //=> 'footer' app instance
```

### App `getChildApp`

A childApp instance can be retrieved from the
App instance using the `getChildApp` method and
passing in the name of the childApp.

```js
var myApp = new Marionette.Toolkit.App();
myApp.addChildApp('foo', Marionette.Toolkit.App);

var fooApp = myApp.getChildApp('foo');
```

### App `getChildApps`

Get all the childApps from the app.
Returns an object literal with named childApps
as attributes.

```js
var myApp = new Marionette.Toolkit.App();
myApp.addChildApp('foo', Marionette.Toolkit.App);
myApp.addChildApp('bar', Marionette.Toolkit.App);

var childApps = myApp.getChildApps();

childApps.foo; //=> foo childApp
childApps.bar; //=> bar childApp
```

### App `removeChildApp`

An app can be removed by calling the `removeChildApp`
method and passing in the name of the app.

```js
var myApp = new Marionette.Toolkit.App();
myApp.addChildApp('foo', Marionette.Toolkit.App);

myApp.addChildApp('bar', {
  AppClass: Marionette.Toolkit.App,
  preventDestroy: true
});

var fooApp = myApp.removeChildApp('foo');

var barApp = myApp.removeChildApp('bar');

// logs true
console.log(fooApp.isDestroyed());

// logs false
console.log(barApp.isDestroyed());
```

The removed app is destroyed unless that app has its
[preventDestroy](./abstract-app.md#apps-preventdestroy) setting set to true.

### App `removeChildApps`

You can quickly remove all childApps from an
App instance by calling the `removeChildApps`
method.

```js
var myApp = new Marionette.Toolkit.App();
myApp.addChildApps({
  foo: Marionette.Toolkit.App,
  bar: Marionette.Toolkit.App,
  baz: Marionette.Toolkit.App
});

myApp.removeChildApps();
```

This will destroy all childApps (that don't have preventDestroy set to true), and remove them.
