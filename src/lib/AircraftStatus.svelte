<script lang="ts">
	import AircraftStatusUi from '$lib/AircraftStatusUi.svelte';
	import { onMount } from 'svelte';

	interface Props {
		id: string;
		callsign: string;
		type?: string | undefined;
	}

	let { id, callsign, type = undefined }: Props = $props();

	type Response = {
		camo: string | undefined;
		'easa-type': string | undefined;
		'easa-variant': string | undefined;
	};

	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	let isLoading = $state(true);
	let response: Response | null = $state(null);
	let error: unknown | null = $state(null);

	let type_ = $derived(type
		? type
		: response?.['easa-type'] === response?.['easa-variant']
			? response?.['easa-type']
			: `${response?.['easa-type']} ${response?.['easa-variant']}`);

	let status_ = $derived(isLoading
		? 'loading'
		: error
			? 'error'
			: response?.camo === 'airworthy'
				? 'airworthy'
				: response?.camo === 'grounded'
					? 'grounded'
					: response?.camo === 'prewarning'
						? 'prewarning'
						: 'unknown');

	onMount(() => {
		update();
		return () => clearTimeout(timeoutId);
	});

	async function update() {
		clearTimeout(timeoutId);

		isLoading = true;
		try {
			response = await load(id);
			error = null;
		} catch (e) {
			response = null;
			error = e;
		}

		isLoading = false;
		timeoutId = setTimeout(update, 60000);
	}

	async function load(id: string) {
		let response = await fetch(`https://api.camo-europe.aero/statuses/${id}`);
		if (!response.ok) {
			throw new Error('API request failed');
		}

		let json = await response.json();
		return json.data.attributes;
	}
</script>

<AircraftStatusUi {callsign} type={type_} status={status_} onClick={update} />
