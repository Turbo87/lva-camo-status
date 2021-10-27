import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Pretender from 'pretender';
import defer from 'p-defer';

const AIRWORTHY_RESPONSE = {
  data: {
    id: 'WTsHJRdZ',
    type: 'status',
    attributes: {
      timestamp: '2018-05-30T08:13:21+00:00',
      camo: 'airworthy',
      ato: 'unknown',
      'easa-type': 'ASK 21',
      'easa-variant': 'ASK 21',
    },
    relationships: { aircraft: { data: { id: 'WTsHJRdZ', type: 'aircraft' } } },
    included: [
      {
        id: 'WTsHJRdZ',
        type: 'aircraft',
        attributes: { 'easa-type': 'ASK 21', 'easa-variant': 'ASK 21' },
      },
    ],
  },
};

let GROUNDED_RESPONSE = {
  data: {
    id: 'WTsHJRdZ',
    type: 'status',
    attributes: {
      timestamp: '2018-05-30T08:13:21+00:00',
      camo: 'grounded',
      ato: 'unknown',
      'easa-type': 'ASK 21',
      'easa-variant': 'ASK 21',
    },
    relationships: { aircraft: { data: { id: 'WTsHJRdZ', type: 'aircraft' } } },
    included: [
      {
        id: 'WTsHJRdZ',
        type: 'aircraft',
        attributes: { 'easa-type': 'ASK 21', 'easa-variant': 'ASK 21' },
      },
    ],
  },
};

module('Integration | Component | aircraft-status', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.server = new Pretender();
  });

  hooks.afterEach(function () {
    this.server.shutdown();
  });

  test('it renders airworthy correctly', async function (assert) {
    this.server.get(
      'https://api.camo-europe.aero/statuses/WTsHJRdZ',
      function () {
        return [200, {}, JSON.stringify(AIRWORTHY_RESPONSE)];
      }
    );

    await render(hbs`<AircraftStatus @id="WTsHJRdZ" @callsign="D-8784"/>`);

    assert.dom('button').hasAttribute('data-status', 'airworthy');
    assert.dom('[data-test-callsign]').hasText('D-8784');
    assert.dom('[data-test-type]').hasText('ASK 21');
  });

  test('it renders grounded correctly', async function (assert) {
    this.server.get(
      'https://api.camo-europe.aero/statuses/WTsHJRdZ',
      function () {
        return [200, {}, JSON.stringify(GROUNDED_RESPONSE)];
      }
    );

    await render(hbs`<AircraftStatus @id="WTsHJRdZ" @callsign="D-8784"/>`);

    assert.dom('button').hasAttribute('data-status', 'grounded');
    assert.dom('[data-test-callsign]').hasText('D-8784');
    assert.dom('[data-test-type]').hasText('ASK 21');
  });

  test('it renders error state correctly', async function (assert) {
    this.server.get(
      'https://api.camo-europe.aero/statuses/WTsHJRdZ',
      function () {
        return [500, {}, JSON.stringify({})];
      }
    );

    await render(hbs`<AircraftStatus @id="WTsHJRdZ" @callsign="D-8784"/>`);

    assert.dom('button').hasAttribute('data-status', 'error');
    assert.dom('[data-test-callsign]').hasText('D-8784');
    assert.dom('[data-test-type]').hasNoText();
  });

  test('can override aircraft type', async function (assert) {
    this.server.get(
      'https://api.camo-europe.aero/statuses/WTsHJRdZ',
      function () {
        return [200, {}, JSON.stringify(AIRWORTHY_RESPONSE)];
      }
    );

    await render(
      hbs`<AircraftStatus @id="WTsHJRdZ" @callsign="D-8784" @type="AlphaJet"/>`
    );

    assert.dom('button').hasAttribute('data-status', 'airworthy');
    assert.dom('[data-test-callsign]').hasText('D-8784');
    assert.dom('[data-test-type]').hasText('AlphaJet');
  });

  test('shows loading indicator while loading', async function (assert) {
    let deferred = defer();

    this.server.get(
      'https://api.camo-europe.aero/statuses/WTsHJRdZ',
      () => deferred.promise
    );

    render(hbs`<AircraftStatus @id="WTsHJRdZ" @callsign="D-8784"/>`);

    await waitFor('button');
    assert.dom('button').hasAttribute('data-status', 'loading');

    deferred.resolve([200, {}, JSON.stringify(AIRWORTHY_RESPONSE)]);
  });
});
