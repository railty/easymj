<script>
	import { onMount} from 'svelte';
	import Menu from './menu.svelte';

	onMount(async () => {
		console.log("on mount");
	});

</script>

<Menu>
	<h1 class="p-4 text-lg font-bold text-blue-600 hover:text-blue-300"><a href="web-mobile">Download from Apple App Store</a></h1>
	<h1 class="p-4 text-lg font-bold text-blue-600 hover:text-blue-300"><a href="web-mobile">Play in browser</a></h1>
</Menu>
