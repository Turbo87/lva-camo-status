import Ember from 'ember';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

import fetch from 'fetch';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  // id: null,
  // callsign: null,

  // status: null, // set by the fetchTask

  status: alias('updateTask.last.value'),
  isLoading: alias('updateTask.isRunning'),
  isError: alias('updateTask.last.isError'),

  type: computed('status', function() {
    let status = this.get('status');
    if (!status) {
      return null;
    } else if (status['easa-type'] === status['easa-variant']) {
      return status['easa-type'];
    } else {
      return `${status['easa-type']} ${status['easa-variant']}`;
    }
  }),

  isAirworthy: computed('status', function() {
    let status = this.get('status');
    if (!status) {
      return null;
    } else {
      return status.camo === 'airworthy' && (status.ato === 'unknown' || status.ato === 'airworthy');
    }
  }),

  airworthinessClass: computed('isAirworthy', function() {
    let airworthy = this.get('isAirworthy');
    return airworthy === true
      ? 'aircraft-status--ok'
      : airworthy === false
        ? 'aircraft-status--nope'
        : null;
  }),

  init() {
    this._super(...arguments);
    this.get('loopTask').perform();
  },

  loopTask: task(function *() {
    while (true) {
      yield this.get('updateTask').perform();

      if (Ember.testing) {
        break;
      }

      yield timeout(60000);
    }
  }).restartable(),

  updateTask: task(function *() {
    let response = yield fetch(`https://api.camo-europe.aero/statuses/${this.get('id')}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }

    let json = yield response.json();
    return json.data.attributes;
  }).drop(),
});
