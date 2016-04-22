if(!global.document || !global.window) {
  const jsdom = require('jsdom').jsdom;

  global.document = jsdom('<html><head><script></script></head><body><div id="testDiv"></div></body></html>', {
    FetchExternalResources: ['script'],
    ProcessExternalResources: ['script'],
    MutationEvents: '2.0',
    QuerySelector: false
  });

  global.window = document.defaultView;
  global.navigator = global.window.navigator;
}

global.$ = global.jQuery = require('jquery');

global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));

require('babel-register');
require('./setup')();
