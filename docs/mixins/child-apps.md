# ChildAppsMixin

`ChildAppsMixin` is a private mixin for [`App`](./../app.md). It adds functionality to add or remove child Apps to a parent App and connects the child App lifecycle with the parent App lifecycle.

## Documentation Index
* [ChildAppsMixin's Lifecycle Settings](#childappsmixins-lifecycle-settings)
* [ChildAppsMixin's `childApps`](#apps-childapps)
* [ChildAppsMixin API](#childappsmixin-api)
  * [ChildAppsMixin `buildApp`](#childappsmixin-buildapp)
  * [ChildAppsMixin `addChildApp`](#childappsmixin-addchildapp)
  * [ChildAppsMixin `addChildApps`](#childappsmixin-addchildapps)
  * [ChildAppsMixin `getName`](#childappsmixin-getname)
  * [ChildAppsMixin `getChildApp`](#childappsmixin-getchildapp)
  * [ChildAppsMixin `getChildApps`](#childappsmixin-getchildapps)
  * [ChildAppsMixin `removeChildApp`](#childappsmixin-removechildapp)
  * [ChildAppsMixin `removeChildApps`](#childappsmixin-removechildapps)
  * [ChildAppsMixin `startChildApp`](#childappsmixin-startChildApp)
  * [ChildAppsMixin `stopChildApp`](#childappsmixin-stopChildApp)

## ChildAppsMixin's Lifecycle Settings

`childApp` lifecycles may be determined by the settings applied to a `childApp` itself.  For more information read [App Lifecycle Settings](../app.md#lifecycle-settings)

### App's `childApps`
`childApps` is an object literal or a function that returns an object literal.
The object literal must contain app names as keys and app definitions as values.
`childApps` can be passed to an `App` at instantiation or defined on the definition.
If defined as a function it will receive the `options` passed to the `constructor`.

```js
var MyApp = Marionette.Toolkit.App.extend({
  childApps: function(options){
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

## ChildAppsMixin API

### ChildAppsMixin `buildApp`
Child instances are built through this function.
Override it if a parent app has additional concerns when building its children.

```js
buildApp: function(AppClass, options) {
  return new AppClass(options);
}
```

### ChildAppsMixin `addChildApp`

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

### ChildAppsMixin `addChildApps`

`App`s can also be added en-masse through the use
of the `addChildApps` method. This method takes an object
literal or a function that returns an object literal.
The object literal must contain app names as keys
and app definitions as values.

```js
var ChildAppsMixin = new Marionette.Toolkit.App();

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

### ChildAppsMixin `getName`

An App's name can be retrieved from the App
instance calling the `getName` method on the
instance. If the app is a childApp then the
app name will be returned, however if an app
is not a childApp or is a parentApp `undefined`
will be returned.

```js
var myApp = new Marionette.Toolkit.App();

myApp.addChildApp('bar', Marionette.Toolkit.App);
var barAppName = myApp.getChildApp('bar').getName();

// logs bar
console.log(barAppName);

var myAppName = myApp.getName();

// logs undefined
console.log(myAppName);
```

### ChildAppsMixin `getChildApp`

A childApp instance can be retrieved from the
App instance using the `getChildApp` method and
passing in the name of the childApp.

```js
var myApp = new Marionette.Toolkit.App();
myApp.addChildApp('foo', Marionette.Toolkit.App);

var fooApp = myApp.getChildApp('foo');
```

### ChildAppsMixin `getChildApps`

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

### ChildAppsMixin `removeChildApp`

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
[preventDestroy](../app.md#apps-preventdestroy) setting set to true.

### ChildAppsMixin `removeChildApps`

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

### ChildAppsMixin `startChildApp`

You can quickly start a specific childApp from an
App instance by calling the `startChildApp`
method and passing the childApp name and any options.

```js
var childApps = {
   cA1: Marionette.Toolkit.App.extend({
     onStart(options) {
       this.mergeOptions(options, ['foo']);
     }
   })
};

var myApp = new Marionette.Toolkit.App({ childApps: childApps });

// Once you have the childApp instance stored, you can also do childAppInstance.start();
var childAppInstance = myApp.startChildApp('cA1', { foo: 'bar' });

// true
console.log(childAppInstance.isRunning());

// bar
console.log(childAppInstance.getOption('foo'));
```

Note: The parentApp instance is returned for chaining.

### ChildAppsMixin `stopChildApp`

You can quickly stop a specific childApp from an
App instance by calling the `stopChildApp`
method and passing the childApp name.

```js
var myApp = new Marionette.Toolkit.App({ childApps: { cA1: Marionette.Toolkit.App } });

var childAppInstance = myApp.startChildApp('cA1');

// true
console.log(childAppInstance.isRunning());

// This is equivalent to childAppInstance.stop();
myApp.stopChildApp('cA1', { foo: 'bar' });

// false
console.log(childAppInstance.isRunning());

// bar
console.log(childAppInstance.getOption('foo'));
```

Note: The parentApp instance is returned for chaining.
