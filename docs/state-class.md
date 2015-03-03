# Marionette.Toolkit.StateClass

`Marionette.Toolkit.StateClass` is a `Marionette.Object` with a `Backbone.Model` for keeping state.

Use a `StateClass` if your object needs to maintain information that isn't business data.  This provides a consistent method for storing and getting state, along with triggering related events.

## Documentation Index

* [StateClass's `StateModel`](#stateclasss-statemodel)
* [StateClass's `stateDefaults`](#stateclasss-statedefaults)
* [StateClass's `stateEvents`](#stateclasss-stateevents)
* [StateClass API](#stateclass-api)
  * [StateClass `getStateModelClass`](#stateclass-getstatemodelclass)
  * [Setting State `setState`](#setting-state)
  * [Getting State `getState`](#getting-state)
  * [Destroying A StateClass `destroy`](#destroying-a-stateclass)

### StateClass's `StateModel`

Specify a `StateModel` in your state class definition. This must be
a `Backbone.Model` object definition, not an instance.  If you do not
specify a `StateModel`, a vanilla `Backbone.Model` definition will be used.

```js
var MyStateModel = Backbone.Model.extend({});

Marionette.Toolkit.StateClass.extend({
  StateModel: MyStateModel
});
```

The state model must be defined before it is referenced by the
`StateModel` attribute in a state class definition.
Use `getStateModelClass` to lookup the definition as state classes are instantiated.

Alternatively, you can specify a `StateModel` in the options for
the constructor:

```js
var MyStateClass = Marionette.Toolkit.StateClass.extend({...});

new MyStateClass({
  StateModel: MyStateModel
});
```

### StateClass's `stateDefaults`

`stateDefaults` can be a hash or function on the definition
or passed as an option when instantiating to define the initial default state.

```js
var MyStateClass = Marionette.Toolkit.StateClass.extend({
  stateDefaults: {
    fooState: 'bar'
  }
});

var myStateClass = new MyStateClass();

myStateClass.getState('fooState') === 'bar';
```

### StateClass's `stateEvents`

StateClass can bind directly to state events in a declarative manner:

```js
var MyStateClass = Marionette.Toolkit.StateClass.extend({
  stateEvents: {
    'change': 'stateChanged'
  },
  stateChanged: function(model, options){
    console.log('Changed!');
  }
});

var myStateClass = new MyStateClass();

// will log "Changed!"
myStateClass.setState('foo', 'bar');

```

For more information on the various declaritive options, see the
implementations of `modelEvents` and `collectionEvents` in the [Marionette.View](./marionette.view.md#viewmodelevents-and-viewcollectionevents) documentation.

## StateClass API

### StateClass `getStateModelClass`
The value returned by this method is the `StateModel` class that will be instantiated when a state class is instatiated.
Override this method for dynamic `StateModel` definitions.

```js
var FooModel = Backbone.Model.extend({});
var BarModel = Backbone.Model.extend({});

var MyStateClass = Marionette.Toolkit.StateClass.extend({
  getStateModelClass: function() {
    if(this.getOption('isFoo')) {
      return FooModel;
    }
    else {
      return BarModel;
    }
  }
});

var myFooStateClass = new MyStateClass({ isFoo: true });
var myBarStateClass = new MyStateClass();
```

### Setting State

`StateClass` has a `setState` method that exposes the `Backbone.Model.set`
for the `StateClass`'s attached `StateModel`.  Implementation will match [Backbone.Model.set](http://backbonejs.org/#Model-set) documentation.

```js
var myStateClass = new Mationette.Toolkit.StateClass({
    stateEvents: {
      'change:foo': 'alert'
    },
    alert: function(){
      console.log('alert!');
    }
});

// This will trigger the "change:foo" event and log "alert!" to the console.
myStateClass.setState('foo', 'bar');
```

### Getting State

`StateClass` has a `getState` method that exposes the `Backbone.Model.get`
for the `StateClass`'s attached `StateModel`.  Implementation will match [Backbone.Model.get](http://backbonejs.org/#Model-get) documentation with the
exception that not passing any attribute to "get" will return the state model
instance.

```js
var MyStateModel =Backbone.Model.extend({
  defaults: {
    foo: 'bar'
  }
});

var myStateClass = new Mationette.Toolkit.StateClass({
  StateModel: MyStateModel
});

// returns "bar"
myStateClass.getState('foo');

// returns myStateClass's MyStateModel instance.
myStateClass.getState();
```

### Destroying A StateClass

`StateClass` has a `destroy` method that unbind the events of the state model.

```js
var MyStateModel = Backbone.Model.extend({
  initialize: function(){
    this.on('change', function(){
      console.log('I changed!');
    });
  }
});

var MyStateClass = Marionette.Toolkit.StateClass.extend({
  StateModel: MyStateModel
});

var myStateClass = new MyStateClass();

// This will console log "I changed!"
myStateClass.setState('foo', 'bar');

myStateClass.destroy();

// This will not log anything to the console
myStateClass.setState('foo', 'baz');
```
