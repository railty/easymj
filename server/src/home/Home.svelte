<script>
	import { onMount} from 'svelte';
	import Menu from '../components/menu.svelte';
	import ContactUs from '../components/contactUs.svelte';

	onMount(async () => {
		console.log("on mount");
	});

	function openMenu(){
		menuOpen = !menuOpen;
	}
	let menuOpen = false;

	let selectedMenu;
</script>

<Menu bind:selectedMenu>
	{#if selectedMenu == 'Contact US'}
		<ContactUs />
	{:else}
		<h1 class="p-4 text-lg font-bold text-blue-600 hover:text-blue-300"><a href="web-mobile">Download from Apple App Store</a></h1>
	    <h1 class="p-4 text-lg font-bold text-blue-600 hover:text-blue-300"><a href="web-mobile">Play in browser</a></h1>
	{/if}
</Menu>

<style type="text/scss">
	* {
		box-sizing: border-box;
	}
</style>
