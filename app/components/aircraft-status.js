import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

import fetch from 'fetch';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  // id: null,
  // callsign: null,

  // status: null, // set by the fetchTask

  isLoading: alias('updateTask.isRunning'),

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
    this.get('updateTask').perform();
  },

  updateTask: task(function *() {
    let response = yield fetch(`https://api.camo-europe.aero/statuses/${this.get('id')}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }

    let json = yield response.json();
    this.set('status', json.data.attributes);
  }),
});
