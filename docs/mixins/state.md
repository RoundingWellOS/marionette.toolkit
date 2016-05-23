# Marionette.Toolkit.StateMixin

`StateMixin` is a public mixin for [`App`](../app.md) or any Marionette class definition that uses a `Backbone.Model` for keeping state.

Use a `StateMixin` if your object/view needs to maintain information that isn't business data.  This provides a consistent method for storing and getting state, along with triggering related events.

## Documentation Index

* [Using StateMixin](#using-statemixin)
* [StateMixin's `StateModel`](#statemixins-statemodel)
* [StateMixin's `stateDefaults`](#statemixins-statedefaults)
* [StateMixin's `stateEvents`](#statemixins-stateevents)
* [StateMixin API](#statemixin-api)
  * [Setting State `setState`](#setting-state)
  * [Getting State `getState`](#getting-state)

### Using StateMixin

While `StateMixin` comes pre-mixined with `Marionette.Toolkit.App` you can extend your own class with `StateMixin` by calling `initState` in your class's `initialize` passing any desired options.

```js
var MyStateModel = Backbone.Model.extend({});

var myClass = Marionette.Object.extend({
  StateModel: MyStateModel

  initialize(options) {
    this.initState(options);
  }
});

_.extend(myClass.prototype, Marrionette.Toolkit.StateMixin)
```

You can also use `Marionette.Toolkit.MixinState` which is a utility to mixin the `StateMixin` into any `Marionette.Object`s or `Marionette.View`s. If there is no `StateModel` definition on your class then the `StateModel` will be defined as a vanilla `Backbone.Model`. However, if you have already defined `StateModel` on your class, your `StateModel` definition **will not be overwritten**.

```js
var MyStateModel = Backbone.Model.extend({});

var myClass = Marionette.Object.extend({
  StateModel: MyStateModel

  initialize(options) {
    this.initState(options);
  }
});

Marionette.Toolkit.MixinState(MyClass);
```

### StateMixin's `StateModel`

Define a `StateModel` on your class definition or pass as an option when calling `initState(options)`. This must be
a `Backbone.Model` object definition, not an instance.  If you do not
specify a `StateModel`, a vanilla `Backbone.Model` definition will be used.

#### Declared on Class
```js
var MyStateModel = Backbone.Model.extend({});

var MyClass = Marionette.Toolkit.App.extend({
  StateModel: MyStateModel

  initialize(options) {
    this.initState(options);
  }
});
```

#### Passed as Option on Initialization
```js
var MyStateModel = Backbone.Model.extend({});

var MyClass = Marionette.Toolkit.App.extend({
  initialize(options) {
    this.initState(options);
  }
});

var myClass = new MyClass(MyStateModel);
```

You can also define `StateModel` as a function. In this form, the value
returned by this method is the `StateModel` class that will be instantiated.
When defined as a function, it will receive the `options` passed to the `constructor`.

```js
var MyStateModel = Backbone.Model.extend({});

Marionette.Toolkit.App.extend({
  StateModel: function(options){
    if(options.foo){
      return MyStateModel;
    }
    return Backbone.Model;
  }
});
```

Alternatively, you can specify a `StateModel` in the options for
the `constructor`:

```js
var MyToolKitApp = Marionette.Toolkit.App.extend({...});

new MyToolKitApp({
  StateModel: MyStateModel
});
```

### StateMixin's `stateDefaults`

`stateDefaults` can be a hash or function on the definition
or passed as an option when instantiating to define the initial default state.

```js
var MyToolKitApp = Marionette.Toolkit.App.extend({
  stateDefaults: {
    fooState: 'bar'
  }
});

var myToolkitApp = new MyToolKitApp();

myToolkitApp.getState('fooState') === 'bar';
```

### StateMixin's `stateEvents`

`StateMixin` can bind directly to state events in a declarative manner:

```js
var MyToolKitApp = Marionette.Toolkit.App.extend({
  stateEvents: {
    'change': 'stateChanged'
  },
  stateChanged: function(model, options){
    console.log('Changed!');
  }
});

var myToolkitApp = new MyToolKitApp();

// will log "Changed!"
myToolkitApp.setState('foo', 'bar');

```

For more information on the various declarative options, see the
implementations of `modelEvents` and `collectionEvents` in the [Marionette.View](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.view.md#viewmodelevents-and-viewcollectionevents) documentation.

## StateMixin API

### Setting State

`StateMixin` has a `setState` method that exposes the `Backbone.Model.set`
for the `StateClass`'s attached `StateModel`.  Implementation will match [Backbone.Model.set](http://backbonejs.org/#Model-set) documentation.

```js
var MyToolKitApp = new Marionette.Toolkit.App({
    stateEvents: {
      'change:foo': 'alert'
    },
    alert: function(){
      console.log('alert!');
    }
});

// This will trigger the "change:foo" event and log "alert!" to the console.
myToolKitApp.setState('foo', 'bar');
```

### Getting State

`StateMixin` has a `getState` method that exposes the `Backbone.Model.get`
for the `StateClass`'s attached `StateModel`.  Implementation will match [Backbone.Model.get](http://backbonejs.org/#Model-get) documentation with the
exception that not passing any attribute to "get" will return the state model
instance.

```js
var MyToolKitApp = Backbone.Model.extend({
  defaults: {
    foo: 'bar'
  }
});

var myToolKitApp = new Marionette.Toolkit.App({
  StateModel: MyStateModel
});

// returns "bar"
myStateClass.getState('foo');

// returns myStateClass's MyStateModel instance.
myStateClass.getState();
```
