<script lang="ts">
	import ThumbDown from '$lib/icons/thumb-down.svg?component';
	import ThumbUp from '$lib/icons/thumb-up.svg?component';
	import Warning from '$lib/icons/warning.svg?component';
	import Error from '$lib/icons/error.svg?component';
	import Refresh from '$lib/icons/refresh.svg?component';

	export let callsign: string;
	export let type: string | undefined = undefined;
	export let status: string;
</script>

<button type="button" data-status={status} on:click>
	<span class="callsign" data-test-callsign>{callsign}</span>
	{#if type}
		<span class="type" data-test-type>{type}</span>
	{/if}

	<span class="icon">
		<ThumbUp style={`opacity:${status === 'airworthy' ? 1 : 0}`} />
		<ThumbDown style={`opacity:${status === 'grounded' ? 1 : 0}`} />
		<Warning style={`opacity:${status === 'prewarning' ? 1 : 0}`} />
		<Error style={`opacity:${status === 'unknown' || status === 'error' ? 1 : 0}`} />
		<Refresh style={`opacity:${status === 'loading' ? 1 : 0}`} />
	</span>
</button>

<style>
	button {
		position: relative;

		display: block;
		width: calc(100% - 16px);
		max-width: 450px;
		margin: 8px;
		padding: 16px;

		font-family: inherit;
		font-size: 100%;
		line-height: 1.15;
		text-align: left;

		background-color: #eee;
		color: #999;
		border: none;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
		cursor: pointer;

		transition:
			background-color 0.2s,
			color 0.2s;
	}

	button[data-status='airworthy'] {
		background: hsla(120, 100%, 35%, 1);
		color: rgba(255, 255, 255, 0.7);
	}

	button[data-status='prewarning'] {
		background: hsla(42, 100%, 50%, 1);
		color: rgba(0, 0, 0, 0.7);
	}

	button[data-status='grounded'] {
		background: hsla(0, 100%, 35%, 1);
		color: rgba(255, 255, 255, 0.7);
	}

	.icon {
		display: contents;
	}

	.icon :global(svg) {
		position: absolute;

		right: 16px;
		top: 16px;
		width: 52px;
		height: 52px;

		opacity: 0;
		transition: opacity 0.2s;
	}

	.callsign {
		font-size: 40px;
		line-height: 52px;
		margin: 0 8px;
	}

	.type {
		font-size: 16px;
		line-height: 16px;
	}

	@media screen and (max-width: 400px) {
		.callsign {
			font-size: 40px;
			line-height: 40px;
		}

		.type {
			display: block;
			margin: 8px 8px 0;
		}

		.icon {
			right: 22px;
			top: 22px;
		}
	}
</style>
