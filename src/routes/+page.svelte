<script>
	import AircraftStatus from '$lib/AircraftStatus.svelte';
</script>

<h1 class="title">CAMO Status LVA</h1>

<AircraftStatus id="2Nr6sRxrj" callsign="D-3886" type="Astir" />
<AircraftStatus id="rACy6WHR" callsign="D-1108" type="LS 4" />
<AircraftStatus id="2PQn9CjUB" callsign="D-0628" type="LS 8" />
<AircraftStatus id="2wesNRmGV" callsign="D-KBBQ" type="Duo Discus XLT" />
<AircraftStatus id="2JRWNcNfX" callsign="D-KUFP" type="HK36 Super Dimona" />

<h1 class="title">CAMO Status Nordstern</h1>

<AircraftStatus id="2LWzettan" callsign="D-5074" type="ASK 21" />
<AircraftStatus id="2o8VgT3ML" callsign="D-0578" type="LS 4" />
<AircraftStatus id="bmknou8D" callsign="D-5424" type="Ka 6" />

<style>
	:global(body) {
		background-color: white;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
			'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
	}

	.title {
		margin: 24px 32px;
		font-size: 24px;
	}
</style>
