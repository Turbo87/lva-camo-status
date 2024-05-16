import { render, waitFor } from '@testing-library/svelte';
import AircraftStatus from './AircraftStatus.svelte';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../vitest-setup';

function dom(selector: string) {
	return document.querySelector(selector);
}

const AIRWORTHY_RESPONSE = {
	data: {
		id: 'WTsHJRdZ',
		type: 'status',
		attributes: {
			timestamp: '2018-05-30T08:13:21+00:00',
			camo: 'airworthy',
			ato: 'unknown',
			'easa-type': 'ASK 21',
			'easa-variant': 'ASK 21'
		},
		relationships: { aircraft: { data: { id: 'WTsHJRdZ', type: 'aircraft' } } },
		included: [
			{
				id: 'WTsHJRdZ',
				type: 'aircraft',
				attributes: { 'easa-type': 'ASK 21', 'easa-variant': 'ASK 21' }
			}
		]
	}
};

const PREWARNING_RESPONSE = {
	data: {
		id: 'WTsHJRdZ',
		type: 'status',
		attributes: {
			timestamp: '2018-05-30T08:13:21+00:00',
			camo: 'prewarning',
			ato: 'unknown',
			'easa-type': 'ASK 21',
			'easa-variant': 'ASK 21'
		},
		relationships: { aircraft: { data: { id: 'WTsHJRdZ', type: 'aircraft' } } },
		included: [
			{
				id: 'WTsHJRdZ',
				type: 'aircraft',
				attributes: { 'easa-type': 'ASK 21', 'easa-variant': 'ASK 21' }
			}
		]
	}
};

const GROUNDED_RESPONSE = {
	data: {
		id: 'WTsHJRdZ',
		type: 'status',
		attributes: {
			timestamp: '2018-05-30T08:13:21+00:00',
			camo: 'grounded',
			ato: 'unknown',
			'easa-type': 'ASK 21',
			'easa-variant': 'ASK 21'
		},
		relationships: { aircraft: { data: { id: 'WTsHJRdZ', type: 'aircraft' } } },
		included: [
			{
				id: 'WTsHJRdZ',
				type: 'aircraft',
				attributes: { 'easa-type': 'ASK 21', 'easa-variant': 'ASK 21' }
			}
		]
	}
};

describe('AircraftStatus.svelte', async () => {
	it('renders airworthy correctly', async () => {
		server.use(
			http.get('https://api.camo-europe.aero/statuses/WTsHJRdZ', () =>
				HttpResponse.json(AIRWORTHY_RESPONSE)
			)
		);

		render(AircraftStatus, { id: 'WTsHJRdZ', callsign: 'D-8784' });
		await waitFor(() => expect(dom('button')).not.toHaveAttribute('data-status', 'loading'));

		expect(dom('button')).toHaveAttribute('data-status', 'airworthy');
		expect(dom('.callsign')).toHaveTextContent('D-8784');
		expect(dom('.type')).toHaveTextContent('ASK 21');
	});

	it('renders grounded correctly', async () => {
		server.use(
			http.get('https://api.camo-europe.aero/statuses/WTsHJRdZ', () =>
				HttpResponse.json(GROUNDED_RESPONSE)
			)
		);

		render(AircraftStatus, { id: 'WTsHJRdZ', callsign: 'D-8784' });
		await waitFor(() => expect(dom('button')).not.toHaveAttribute('data-status', 'loading'));

		expect(dom('button')).toHaveAttribute('data-status', 'grounded');
		expect(dom('.callsign')).toHaveTextContent('D-8784');
		expect(dom('.type')).toHaveTextContent('ASK 21');
	});

	it('renders prewarning correctly', async () => {
		server.use(
			http.get('https://api.camo-europe.aero/statuses/WTsHJRdZ', () =>
				HttpResponse.json(PREWARNING_RESPONSE)
			)
		);

		render(AircraftStatus, { id: 'WTsHJRdZ', callsign: 'D-8784' });
		await waitFor(() => expect(dom('button')).not.toHaveAttribute('data-status', 'loading'));

		expect(dom('button')).toHaveAttribute('data-status', 'prewarning');
		expect(dom('.callsign')).toHaveTextContent('D-8784');
		expect(dom('.type')).toHaveTextContent('ASK 21');
	});

	it('renders error state correctly', async () => {
		server.use(
			http.get(
				'https://api.camo-europe.aero/statuses/WTsHJRdZ',
				() => new HttpResponse('Error', { status: 500 })
			)
		);

		render(AircraftStatus, { id: 'WTsHJRdZ', callsign: 'D-8784' });
		await waitFor(() => expect(dom('button')).not.toHaveAttribute('data-status', 'loading'));

		expect(dom('button')).toHaveAttribute('data-status', 'error');
		expect(dom('.callsign')).toHaveTextContent('D-8784');
		expect(dom('.type')).not.toBeInTheDocument();
	});

	it('can override aircraft type', async () => {
		server.use(
			http.get('https://api.camo-europe.aero/statuses/WTsHJRdZ', () =>
				HttpResponse.json(AIRWORTHY_RESPONSE)
			)
		);

		render(AircraftStatus, { id: 'WTsHJRdZ', callsign: 'D-8784', type: 'AlphaJet' });
		await waitFor(() => expect(dom('button')).not.toHaveAttribute('data-status', 'loading'));

		expect(dom('button')).toHaveAttribute('data-status', 'airworthy');
		expect(dom('.callsign')).toHaveTextContent('D-8784');
		expect(dom('.type')).toHaveTextContent('AlphaJet');
	});

	it('shows loading indicator while loading', async () => {
		server.use(
			http.get('https://api.camo-europe.aero/statuses/WTsHJRdZ', () =>
				HttpResponse.json(AIRWORTHY_RESPONSE)
			)
		);

		render(AircraftStatus, { id: 'WTsHJRdZ', callsign: 'D-8784', type: 'AlphaJet' });
		expect(dom('button')).toHaveAttribute('data-status', 'loading');

		await waitFor(() => expect(dom('button')).not.toHaveAttribute('data-status', 'loading'));
	});
});
