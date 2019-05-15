# ViewEventsMixin

`ViewEventsMixin` is a private mixin for [`App`](../app.md) and [`Component`](../component.md).
It allows the view's events to be handled by its parent.

## Documentation Index

* [Explicit View Event Listeners](#explicit-view-event-listeners)
  * [Attaching Functions](#attaching-functions)
* [Triggering Events on View Events](#triggering-events-on-view-events)
* [`viewEventPrefix`](#vieweventprefix)
* ["view:*" event bubbling from the app and component view](#view-event-bubbling-from-the-app-and-component-view)

### Explicit View Event Listeners

To call specific functions on event triggers, use the `viewEvents`
attribute to map view events to methods on the app or component.

```js
const MyView = Mn.View.extend({
  triggers: {
    'click': 'click:view'
  }
});

const MyApp = Toolkit.App.extend({
  region: '#app-hook',

  viewEvents: {
    'click:view': 'stop'
  },

  onStart() {
    this.showView();
  },

  onStop() {
    console.log('MyApp was stopped');
  }
});

const myApp = new MyApp();

myApp.start{ view: new MyView() }();
```

#### Attaching Functions

The `viewEvents` attribute can also attach functions directly to be event
handlers:

```js
viewEvents: {
  'click:view'(view) {
     console.log(`View ${ view.cid } stopped the app!');
     this.stop();
  }
},

```

### Triggering Events on View Events

A `viewTriggers` hash or method permits proxying of view events without manually
setting bindings. The values of the hash should be a string of the event to trigger on the app or component.

`viewTriggers` is sugar on top of [`viewEvents`](#explicit-view-event-listeners) much
in the same way that [View `triggers`](https://github.com/marionettejs/backbone.marionette/blob/v3.2.0/docs/marionette.view.md#view-triggers)
are sugar for [View `events`](https://github.com/marionettejs/backbone.marionette/blob/v3.2.0/docs/marionette.view.md#view-events).

```js
// The view fires a custom event, `foo:event`
const ComponentView = View.extend({

  // Events hash defines local event handlers that in turn may call `triggerMethod`.
  events: {
    'click .button': 'onClickButton'
  },

  triggers: {
    'submit form': 'submit:form'
  },

  onClickButton() {
    // Both `trigger` and `triggerMethod` events will be caught by the component.
    this.trigger('foo:event', 'foo');
    this.triggerMethod('foo:event', 'bar');
  }
});

// The component uses viewEvents to catch the view's custom event
const MyComponent = Toolkit.Component.extend({
  ViewClass: ComponentView,

  viewTriggers: {
    'foo:event': 'view:foo:event',
    'submit:form': 'view:submit:form'
  },

  onViewFooEvent(message) {
    console.log('A view fired foo:event with ' + message);
  },

  onViewSubmitForm(view) {
    console.log('A view fired submit:form');
  }
});
```

### `viewEventPrefix`

`viewEventPrefix` is `false` by default.

You can customize the event prefix for events that are forwarded
through the app or component. To do this, set the `viewEventPrefix`.
For more information on the `viewEventPrefix` see
["view:*" event bubbling from the app and component view](#view-event-bubbling-from-the-app-and-component-view)

```js
const MyApp = Toolkit.App.extend({
  viewEventPrefix: 'some:prefix'
});

const myApp = new MyApp();

myApp.start({ view: new MyView() });

myApp.on('some:prefix:render', function(){
  // view was rendered
});

// view will be rendered on show
myApp.showView();
```

The `viewEventPrefix` can be provided in the app or component definition or
by passing as an option when instantiating an instance.

### `view:*` event bubbling from the app and component view

When the current view within a component or app triggers an event, if the app or component
has a defined [`viewEventPrefix`](#vieweventprefix) that event will bubble up through
the component with the `viewEventPrefix` prepended to the event name.  Override
the prefix by setting `viewEventPrefix`.

That is if a view has a `viewEventPrefix` of "view", when a current view triggers "event:name",
the app or component will then trigger "view:event:name" on itself.

```js
const MyView = View.extend({
  triggers: {
    'click button': 'click:button'
  }
});

// get the collection view in place
const myComponent = new Toolkit.Component(null, {
  viewEventPrefix: 'view',

  ViewClass: MyView,

  onViewClickButton: function(view, ...args) {
    console.log('I said, "button clicked!"');
  }
});

myComponent.on('view:click:button', function(view, ...args){
  console.log("My component said, 'button clicked!'");
});
```

Now, whenever the button inside the view is clicked, both messages will log to the console.
