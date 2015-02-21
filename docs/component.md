# Marionette.Toolkit.Component

`Marionette.Toolkit.Component` is heavily influenced by **@jfairbank**'s [Marionette.Component](https://github.com/jfairbank/marionette.component)

## Documentation Index
  [Example](#example)

## Example

```js
  var MyComponent = Toolkit.Component.extend({
      state model defaults
      defaults: {
          pressed: true
      },
      viewEventPrefix: 'mine',
      viewOptions: {
          className: 'button--light-gradient faux-select w-100',
          templateHelpers: { }
      },
      stateEvents: {
          'change:state_attribute': 'onNameChange'
      },
      onNameChange: function(){
          // do stuff ...
      }
  });

  var test_component = new MyComponent({},{
      viewClass: MyView
      viewEventPrefix: 'special:mine'
      viewOptions: {}
      region: this.layout.my_region
  });

  test_component.showIn(this.layout.region);
```



