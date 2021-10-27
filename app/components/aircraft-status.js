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

    let type = this.response?.['easa-type'];
    let variant = this.response?.['easa-variant'];

    if (type === variant) {
      return type;
    } else {
      return `${type} ${variant}`;
    }
  }

  get status() {
    return this.isLoading
      ? 'loading'
      : this.isError
      ? 'error'
      : this.response?.camo === 'airworthy'
      ? 'airworthy'
      : this.response
      ? 'grounded'
      : 'unknown';
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
