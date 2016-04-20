if(!global.document || !global.window) {
  const jsdom = require('jsdom').jsdom;

  global.document = jsdom('<html><head><script></script></head><body><div id="testDiv"></div></body></html>', null, {
    FetchExternalResources: ['script'],
    ProcessExternalResources: ['script'],
    MutationEvents: '2.0',
    QuerySelector: false
  });

  global.window = document.parentWindow;
  global.navigator = global.window.navigator;
  global.location = global.window.location;
}

global.$ = global.jQuery = require('jquery');

global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));

require('babel/register');
require('./setup')();
