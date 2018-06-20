import Application from '@ember/application';
import loadInitializers from 'ember-load-initializers';
import defineModifier from 'ember-concurrency-test-waiter/define-modifier';

import config from './config/environment';
import Resolver from './resolver';

defineModifier();

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
