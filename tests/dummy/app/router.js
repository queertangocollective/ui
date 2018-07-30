import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home', { path: '/' });
  this.route('apple');
  this.route('banana');
  this.route('coconut');
  this.route('durian');
  this.route('elderberry');
  this.route('fig');
  this.route('grape');
  this.route('honeydew');
});

export default Router;
