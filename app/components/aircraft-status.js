import Component from '@glimmer/component';

import fetch from 'fetch';
import { restartableTask, dropTask, rawTimeout } from 'ember-concurrency';
import { reads } from 'macro-decorators';

export default class extends Component {
  // id: null,
  // callsign: null,

  @reads('updateTask.last.value') response;
  @reads('updateTask.isRunning') isLoading;
  @reads('updateTask.last.isError') isError;

  get type() {
    if (this.args.type) {
      return this.args.type;
    }

    let { response } = this;
    if (!response) {
      return null;
    } else if (response['easa-type'] === response['easa-variant']) {
      return response['easa-type'];
    } else {
      return `${response['easa-type']} ${response['easa-variant']}`;
    }
  }

  get isAirworthy() {
    let { response } = this;
    if (!response) {
      return null;
    } else {
      return response.camo === 'airworthy';
    }
  }

  get status() {
    return this.isLoading
      ? 'loading'
      : this.isError
      ? 'error'
      : this.isAirworthy === true
      ? 'airworthy'
      : this.isAirworthy === false
      ? 'grounded'
      : null;
  }

  constructor() {
    super(...arguments);
    this.loopTask.perform();
  }

  @restartableTask *loopTask() {
    while (true) {
      yield this.updateTask.perform();
      yield rawTimeout(60000);
    }
  }

  @dropTask *updateTask() {
    let response = yield fetch(
      `https://api.camo-europe.aero/statuses/${this.args.id}`
    );
    if (!response.ok) {
      throw new Error('API request failed');
    }

    let json = yield response.json();
    return json.data.attributes;
  }
}
