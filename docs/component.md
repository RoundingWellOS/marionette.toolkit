# Marionette.Toolkit.Component

`Marionette.Toolkit.Component` is heavily influenced by **@jfairbank**'s [Marionette.Component](https://github.com/jfairbank/marionette.component) and is an extension of `Marionette.Application`.
The Component provides a consistent interface for which to package state-view-logic.
It utilizes the following mixins:

* [`StateMixin`](./mixins/state.md) manages a view (or views) whose lifecycle is tied to the region it is shown in.
* [`ViewEventsMixin`](./mixins/view-events.md) for proxying events from the component's view to the app.

## Documentation Index
* [Using a Component](#using-a-component)
* [Component's `ViewClass`](#components-viewclass)
  * [Component's `regionOptions`](#components-regionoptions)
  * [Component's `viewOptions`](#components-viewoptions)
* [Component's `region`](#components-region)
  * [Component Class `setRegion`](#component-class-setregion)
* [Component's view](#components-view)
* [Component Events](#component-events)
  * ["before:show" / "show" events](#beforeshow--show-events)
  * [View Events](#view-events)
* [Component API](#component-api)
  * [Component `showIn`](#component-showin)
  * [Component `show`](#component-show)
  * [Component `empty`](#component-empty)
  * [Component `mixinOptions`](#component-mixinoptions)
  * [Component `buildView`](#component-buildview)
  * [Component `destroy`](#component-destroy)

## Using a Component

The component is built to work out of the box.
When instantiating a component you can pass various options including `ViewClass` or initial component `state`.

```js
const MyComponentView = View.extend({
  template: _.template('<div>Hello Component</div>')
});

const options = {
  fooOption: 'baz',
  ViewClass: MyComponentView,
  state: {
    fooState: 'bar'
  }
};

const myComponent = new Component(options);

myComponent.getState('fooState') === 'bar';

myComponent.getOption('fooOption') === 'baz';

//show "Hello Component" in someRegion
myComponent.showIn(someRegion);
```

### Component's `ViewClass`

Specify a `ViewClass` in your component definition. This can be any
`Backbone.View` or `Marionette.View` type. This must be
a view definition, not an instance.  If you do not specify a
`ViewClass`, a vanilla `Marionette.View` definition will be used.

```js
const MyViewClass = View.extend({});

Component.extend({
  ViewClass: MyViewClass
});
```

You can also define `ViewClass` as a function. In this form, the value
returned by this method is the `ViewClass` class that will be instantiated.
When defined as a function, it will receive the `options` passed to [`show`](#component-show).

```js
const MyViewClass = View.extend({});

Component.extend({
  ViewClass(options){
    if(options.foo){
      return MyViewClass;
    }
    return Marionette.View;
  }
});
```

The `ViewClass` can be provided in the component definition or
in the constructor function call, to get a component instance.

You can also manage the state of the ViewClass by mixing in the [`StateMixin`](./mixins/state.md) into your view.

This can be done by using the `Marionette.Toolkit.mixinState` Utility.

```js
const MyViewClass = View.extend({});

mixinState(MyViewClass);

Component.extend({
  ViewClass: MyViewClass
});
```

### Component's `regionOptions`

You may need to pass data to your component's region instance. To do this, provide
a `regionOptions` definition on your component as an object literal. This will
be passed to the `region#show` as part of the `options`.

```js
const MyRegion = Region.extend({
  ...
  onShow(region, view, { foo }) {

  }
});

const MyComponent = Component.extend({
  region: new MyRegion(),
  regionOptions: {
    foo: 'bar'
  }
});
```

You can also specify the `regionOptions` as a function, if you need to
calculate the values to return at runtime.

### Component's `viewOptions`

You may need to pass data to your component's view instance. To do this, provide
a `viewOptions` definition on your component as an object literal. This will
be passed to the constructor of your view as part of the `options`.

```js
const MyView = View.extend({
  initialize(options) {
    console.log(options.foo); // => "bar"
  }
});

const MyComponent = Component.extend({
  ViewClass: MyView,

  viewOptions: {
    foo: 'bar'
  }
});
```

You can also specify the `viewOptions` as a function, if you need to
calculate the values to return at runtime. The function must return
an object, and the attributes of the object will be copied to the
component view instance's options.

```js
const MyComponent = Component.extend({
  viewOptions() {
    return {
      foo: 'bar'
    };
  }
});
```

### Component's `region`

Each component instance will need one region during its lifetime,
and when this region is emptied the component is destroyed.
You can set the region by passing it as an option at instantiation,
by setting it directly on the Component's definition, or by passing
it to the [`showIn`](#component-showin) method.

#### Component Class `setRegion`

`setRegion` is available as sugar for `MyComponentClass.prototype.region =`.
This allows for generic (possibly 3rd party) components to be created where
all instances within an app are given a specific region.

```js
import DatePicker from 'some-toolkit-datepicker';

DatePicker.setRegion(myApp.getRegion('top'));
```

### Component's view

To retrieve a component's view you can use `Marionette.Application`'s `getView()`

```js
const myComponent = new MyComponent({
  stateEvents: {
    'change:selected'(){
      // this.getView()
    }
  }
});

myComponent.show({
  className: 'my-component-class'
});

// Works but best to use the component to interface with the view.
const view = myComponent.getView();
```

## Component Events

### `before:show` / `show` events

The "before:show" event and corresponding `onBeforeShow`
method are triggered just before building the `ViewClass` instance
and showing it in the component's `region`.

The "show" event and corresponding `onShow`
method are triggered after building and rendering the view
into the component's `region`.

```js
const MyComponent = Component.extend({
  // ...

  onBeforeShow(){
    // ...
  },

  onShow(){
    // ...
  }
});

const myComponent = new MyComponent({...});

myComponent.on('before:show', function(){
  // ...
});

myComponent.on('show', function(){
  // ...
});
```

### View Events

View events for a Component's view can be proxied following a very similar API to what you would
expect on a `Marionette.View` and `Marionette.CollectionView` with their children.

You can use `viewEvents`, `viewTriggers` and `viewEventPrefix` for auto-proxying events.

For more information see the [ViewEventsMixin documentation](./mixins/view-events.md).

## Component API

### Component `showIn`

Sets the component's `region` and then calls `show` on the component

```js
const myComponent = new MyComponent();

const viewOptions = {
  className: 'my-component-class'
};

const regionOptions = {
  replaceElement: true
};

myComponent.showIn(someRegion, viewOptions, regionOptions);
```
### Component `show`

Renders the view and shows it in the component's region.
A region must be defined on the component and a component can only be
shown once during its lifetime.
`show` triggers ["before:show" / "show" events](#beforeshow--show-events).

```js
const MyComponent = Component.extend({
  ViewClass: MyViewClass,
  region: someRegion
});

const viewOptions = {
  className: 'my-component-class'
};

const myComponent = new MyComponent();

myComponent.show(viewOptions, { replaceElement: true });
```

### Component `empty`

Empties the region without destroying the component.
If the region is emptied outside of this method, the component would be destroyed.

```js
const MyComponent = Component.extend({
  ViewClass: MyViewClass,
  region: someRegion
});

const myComponent = new MyComponent();

myComponent.show(viewOptions, { replaceElement: true });

myComponent.empty();

myComponent.isDestroyed(); // false

myComponent.show(viewOptions);

myComponent.getRegion().empty();

myComponent.isDestroyed(); // true
```

### Component `mixinRegionOptions`

Mixes options passed to the method with the Component's [`regionOptions`](#components-regionoptions).
This function is used internally by [`show`](#component-show)
however you can override this function if you need to dynamically build the region options hash.

```js
mixinRegionOptions(options){
  const regionOptions = _.result(this, 'regionOptions');

  return _.extend({ }, regionOptions, options);
}
```

### Component `mixinViewOptions`

Mixes options passed to the method with the Component's [`viewOptions`](#components-viewoptions) and the current component `state`.
This function is used internally by [`show`](#component-show)
however you can override this function if you need to dynamically build the view options hash.

```js
mixinViewOptions(options){
  const viewOptions = _.result(this, 'viewOptions');

  return _.extend({ state: this.getState().attributes }, viewOptions, options);
}
```

### Component `buildView`

When a custom view instance needs to be created dynamically for the `currentView`
that represents the component, override the `buildView` method. This method
takes two parameters and returns a view instance to be used as the current view.
Useful if changing the `ViewClass` based on component state.

```js
buildView(ViewClass, viewOptions){
  return new ViewClass(viewOptions);
}
```

### Component `destroy`

Calling `destroy` will empty the `Component`'s `region` and destroy the `Component`.
A destroyed `Component` instance should not be reused.
