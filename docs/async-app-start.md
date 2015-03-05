# How to easily start apps asynchronously

Most applications need to load data at some point in their lifetime.
There are plenty of good strategies for loading data.  As such Toolkit
is not specifically opinionated as to how you should do this.  Additionally,
not supporting async directly allows the use of any promise library or async
method of your choosing.  If you need to start an app after data is loaded,
or perhaps for any other async reason, it is easy to get started.

## Overriding `triggerStart`

Toolkit provides a simple method to override for async injection.

```js
triggerStart: function(options) {
  this.triggerMethod('start', options);
}
```

Simply override this function in a manner such that `this.triggerMethod('start', options);` occurs asynchronously.

```js
var MyAsyncApp = Marionette.Toolkit.App.extend({
  triggerStart: function(options){
    // Remove the sync call to triggerMethod
    //this.triggerMethod('start', options);

    // Setup a listener for an event triggered by the completion of the async event
    // We trigger an event so that if the app is destroyed during the async request
    // the trigger will not occur, where-as triggerMethod would still call onStart
    this.on('sync:data', _.partial(this.triggerMethod, 'start', options));

    this._fetchData(options);
  },
  _fetchData: function(options){
    $.when(this.beforeStart(options)).then(_.bind(this.trigger, this, 'sync:data'));
  },
  beforeStart: function(options){
    return $.Deferred().resolve();
  }
});

var MyApp = MyAsyncApp.extend({
  beforeStart: function(){
    return MyModel.fetch();
  },
  onStart: function(options, model){
    // do something with the loaded model
  }
});

```
