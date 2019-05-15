# Marionette.Toolkit.Component

`Marionette.Toolkit.Component` is heavily influenced by **@jfairbank**'s [Marionette.Component](https://github.com/jfairbank/marionette.component) and is an extension of `Marionette.Application`.
The Component provides a consistent interface for which to package state-view-logic.
It utilizes the following mixins:

* [`StateMixin`](./mixins/state.md) manages a view (or views) whose lifecycle is tied to the region it is shown in.
* [`ViewEventsMixin`](./mixins/view-events.md) for proxying events from the component's view to the app.

## Documentation Index
* [Using a Component](#using-a-component)
* [Component's `ViewClass`](#components-viewclass)
  * [Component's `viewOptions`](#components-viewoptions)
* [Component's `region`](#components-region)
* [Component Events](#component-events)
  * ["before:show" / "show" events](#beforeshow--show-events)
  * ["before:render:view" / "render:view" events](#beforerenderview--renderview-events)
  * [View Events](#view-events)
* [Component API](#component-api)
  * [Component `showIn`](#component-showin)
  * [Component `show`](#component-show)
  * [Component `renderView`](#component-renderview)
  * [Component `currentView`](#component-currentview)
  * [Component `showView`](#component-showview)
  * [Component `mixinOptions`](#component-mixinoptions)
  * [Component `buildView`](#component-buildview)
  * [Component `destroy`](#component-destroy)

## Using a Component

The component is built to work out of the box.
When instantiating a component you can pass various options including `ViewClass` or initial component `state`.

```js
const MyComponentView = Marionette.View.extend({
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
const MyViewClass = Marionette.View.extend({});

Component.extend({
  ViewClass: MyViewClass
});
```

You can also define `ViewClass` as a function. In this form, the value
returned by this method is the `ViewClass` class that will be instantiated.
When defined as a function, it will receive the `options` passed to [`renderView`](#component-renderview).

```js
const MyViewClass = Marionette.View.extend({});

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

This can be done by using the `Marionette.Toolkit.MixinState` Utility.

```js
const MyViewClass = Marionette.View.extend({});

MixinState(MyViewClass);

Component.extend({
  ViewClass: MyViewClass
});
```

### Component's `viewOptions`

You may need to pass data to your component's view instance. To do this, provide
a `viewOptions` definition on your component as an object literal. This will
be passed to the constructor of your view as part of the `options`.

```js
const MyView = Marionette.View.extend({
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

## Component Events

### `before:show` / `show` events

The "before:show" event and corresponding `onBeforeShow`
method are triggered just before building the `ViewClass` instance
and showing it in the component's `region`.

The "show" event and corresponding `onShow`
method are triggered after building and rendering the `currentView`
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

### `before:render:view` / `render:view` events

The "before:render:view" event and corresponding `onBeforeRenderView`
method are triggered just after building the `ViewClass` instance
and proxying its events, but before showing it in the component's `region`.

The "render:view" event and corresponding `onRenderView`
method are triggered after building and rendering the `currentView`
into the component's `region`.

```js
const MyComponent = Component.extend({
  // ...

  onBeforeRenderView(currentView){
    // ...
  },

  onRenderView(currentView){
    // ...
  }
});

const myComponent = new MyComponent({...});

myComponent.on('before:render:view', function(currentView){
  // ...
});

myComponent.on('render:view', function(currentView){
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

myComponent.showIn(someRegion, viewOptions);
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

myComponent.show(viewOptions);
```

### Component `renderView`

Builds the view from the ViewClass with the options from [`mixinOptions`](#component-mixinoptions)
and attaches it to the component's `currentView`. It then shows the `currentView` in the component's `region` via `showView`.
During this `region.show` the component will not destroy itself on the region's empty event.
While a component can only be shown once, it can be re-rendered many times.
`renderView` triggers ["before:render:view" / "render:view" events](#beforerenderview--renderview-events).

```js
const MyComponent = Component.extend({
  ViewClass: MyViewClass,
  region: someRegion
});

const myComponent = new MyComponent();

myComponent.show({
  className: 'my-component-class'
});

myComponent.renderView({
  className: 'other-component-class'
});
```

### Component `currentView`

When [`renderView`](#component-renderview) is called, the view built and rendered
is attached to the component as `currentView`.  It is a read-only property and
best used when extending a component rather than from its instantiation.

```js
const myComponent = new MyComponent({
  stateEvents: {
    'change:selected'(){
      // this.currentView...
    }
  }
});

myComponent.show({
  className: 'my-component-class'
});


// Works but best to use the component to interface with the view.
const view = myComponent.currentView;
```

### Component `showView`

Called by `renderView`, it shows the `view` in the component's `region`.
This method can be overridden to change a component's behavior.

```js
const MyComponent = Component.extend({
  ViewClass: MyViewClass,
  region: someRegion,
  showView(view) {
    this.getRegion().show(view, { replaceElement: true });
  }
});

const myComponent = new MyComponent();

// region el is now <div class="my-component-class">
myComponent.renderView({
  className: 'my-component-class'
});
```

### Component `mixinOptions`

Mixes options passed to the method with the Component's [`viewOptions`](#components-viewoptions) and the current component `state`.
This function is used internally by [`renderView`](#component-renderview)
however you can override this function if you need to dynamically build the view options hash.

```js
mixinOptions(options){
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
