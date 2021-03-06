const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiJq = require('chai-jq');

chai.use(sinonChai);
chai.use(chaiJq);

global.chai = chai;
global.sinon = sinon;

if(!global.document || !global.window) {
  const JSDOM = require('jsdom').JSDOM;

  const opts = {
    runScripts: 'dangerously',
    url: 'http://localhost'
  };

  const dom = new JSDOM(`
    <html>
      <head><script></script></head>
      <body></body>
    </html>
  `, opts);

  global.window = dom.window;
  global.document = global.window.document;
  global.navigator = global.window.navigator;
}
require('./setup')();
