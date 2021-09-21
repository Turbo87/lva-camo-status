import { alias } from '@ember/object/computed';
import Component from '@glimmer/component';

import fetch from 'fetch';
import { task, rawTimeout } from 'ember-concurrency';

export default class extends Component {
  // id: null,
  // callsign: null,

  // status: null, // set by the fetchTask

  @alias('updateTask.last.value') status;
  @alias('updateTask.isRunning') isLoading;
  @alias('updateTask.last.isError') isError;

  get type() {
    if (this.args.type) {
      return this.args.type;
    }

    let { status } = this;
    if (!status) {
      return null;
    } else if (status['easa-type'] === status['easa-variant']) {
      return status['easa-type'];
    } else {
      return `${status['easa-type']} ${status['easa-variant']}`;
    }
  }

  get isAirworthy() {
    let { status } = this;
    if (!status) {
      return null;
    } else {
      return status.camo === 'airworthy' && (status.ato === 'unknown' || status.ato === 'airworthy');
    }
  }

  get airworthinessClass() {
    let airworthy = this.isAirworthy;
    return airworthy === true
      ? 'aircraft-status--ok'
      : airworthy === false
        ? 'aircraft-status--nope'
        : null;
  }

  constructor() {
    super(...arguments);
    this.loopTask.perform();
  }

  @(task(function *() {
    while (true) {
      yield this.updateTask.perform();
      yield rawTimeout(60000);
    }
  }).restartable())
  loopTask;

  @(task(function *() {
    let response = yield fetch(`https://api.camo-europe.aero/statuses/${this.args.id}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }

    let json = yield response.json();
    return json.data.attributes;
  }).drop())
  updateTask;
}
