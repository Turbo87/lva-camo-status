import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Pretender from 'pretender';
import RSVP from 'rsvp';

module('Integration | Component | aircraft-status', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender();
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('it renders airworthy correctly', async function(assert) {
    this.server.get('https://api.camo-europe.aero/statuses/WTsHJRdZ', function() {
      let response = {
        'data': {
          'id': 'WTsHJRdZ',
          'type': 'status',
          'attributes': {
            'timestamp': '2018-05-30T08:13:21+00:00',
            'camo': 'airworthy',
            'ato': 'unknown',
            'easa-type': 'ASK 21',
            'easa-variant': 'ASK 21'
          },
          'relationships': {'aircraft': {'data': {'id': 'WTsHJRdZ', 'type': 'aircraft'}}},
          'included': [{
            'id': 'WTsHJRdZ',
            'type': 'aircraft',
            'attributes': {'easa-type': 'ASK 21', 'easa-variant': 'ASK 21'}
          }]
        }
      };

      return [200, {"Content-Type": "application/json"}, JSON.stringify(response)];
    });

    await render(hbs`{{aircraft-status id="WTsHJRdZ" callsign="D-8784"}}`);

    assert.dom('.aircraft-status').hasClass('aircraft-status--ok');
    assert.dom('.aircraft-status__callsign').hasText('D-8784');
    assert.dom('.aircraft-status__type').hasText('ASK 21');
  });

  test('it renders grounded correctly', async function(assert) {
    this.server.get('https://api.camo-europe.aero/statuses/WTsHJRdZ', function() {
      let response = {
        'data': {
          'id': 'WTsHJRdZ',
          'type': 'status',
          'attributes': {
            'timestamp': '2018-05-30T08:13:21+00:00',
            'camo': 'grounded',
            'ato': 'unknown',
            'easa-type': 'ASK 21',
            'easa-variant': 'ASK 21'
          },
          'relationships': {'aircraft': {'data': {'id': 'WTsHJRdZ', 'type': 'aircraft'}}},
          'included': [{
            'id': 'WTsHJRdZ',
            'type': 'aircraft',
            'attributes': {'easa-type': 'ASK 21', 'easa-variant': 'ASK 21'}
          }]
        }
      };

      return [200, {"Content-Type": "application/json"}, JSON.stringify(response)];
    });

    await render(hbs`{{aircraft-status id="WTsHJRdZ" callsign="D-8784"}}`);

    assert.dom('.aircraft-status').hasClass('aircraft-status--nope');
    assert.dom('.aircraft-status__callsign').hasText('D-8784');
    assert.dom('.aircraft-status__type').hasText('ASK 21');
  });

  test('can override aircraft type', async function(assert) {
    this.server.get('https://api.camo-europe.aero/statuses/WTsHJRdZ', function() {
      let response = {
        'data': {
          'id': 'WTsHJRdZ',
          'type': 'status',
          'attributes': {
            'timestamp': '2018-05-30T08:13:21+00:00',
            'camo': 'airworthy',
            'ato': 'unknown',
            'easa-type': 'ASK 21',
            'easa-variant': 'ASK 21'
          },
          'relationships': {'aircraft': {'data': {'id': 'WTsHJRdZ', 'type': 'aircraft'}}},
          'included': [{
            'id': 'WTsHJRdZ',
            'type': 'aircraft',
            'attributes': {'easa-type': 'ASK 21', 'easa-variant': 'ASK 21'}
          }]
        }
      };

      return [200, {"Content-Type": "application/json"}, JSON.stringify(response)];
    });

    await render(hbs`{{aircraft-status id="WTsHJRdZ" callsign="D-8784" type="AlphaJet"}}`);

    assert.dom('.aircraft-status').hasClass('aircraft-status--ok');
    assert.dom('.aircraft-status__callsign').hasText('D-8784');
    assert.dom('.aircraft-status__type').hasText('AlphaJet');
  });

  test('shows loading indicator while loading', async function(assert) {
    let deferred = RSVP.defer();

    this.server.get('https://api.camo-europe.aero/statuses/WTsHJRdZ', function() {
      let response = {
        'data': {
          'id': 'WTsHJRdZ',
          'type': 'status',
          'attributes': {
            'timestamp': '2018-05-30T08:13:21+00:00',
            'camo': 'airworthy',
            'ato': 'unknown',
            'easa-type': 'ASK 21',
            'easa-variant': 'ASK 21'
          },
          'relationships': {'aircraft': {'data': {'id': 'WTsHJRdZ', 'type': 'aircraft'}}},
          'included': [{
            'id': 'WTsHJRdZ',
            'type': 'aircraft',
            'attributes': {'easa-type': 'ASK 21', 'easa-variant': 'ASK 21'}
          }]
        }
      };

      return deferred.promise.then(() => [200, {"Content-Type": "application/json"}, JSON.stringify(response)]);
    });

    render(hbs`{{aircraft-status id="WTsHJRdZ" callsign="D-8784"}}`);

    await waitFor('.aircraft-status');
    assert.dom('.aircraft-status').hasClass('aircraft-status--loading');

    deferred.resolve();
  });
});
