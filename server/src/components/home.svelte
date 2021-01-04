<script>
	import { onMount} from 'svelte';
	import Menu from './menu.svelte';

	onMount(async () => {
		console.log("on mount");
	});

</script>

<Menu>
	<h1 class="p-4 text-lg font-bold text-blue-600 hover:text-blue-300">
		<a href="https://apps.apple.com/app/checkers/id1070255846">
			<img class="w-32" src="css/appstore.png" alt="Download from Apple App Store" />
			Download from Apple App Store
		</a>
	</h1>
	<h1 class="p-4 text-lg font-bold text-blue-600 hover:text-blue-300">
		<a href="web-mobile">
			<img class="bg-black rounded-md p-3 w-32" src="css/browser.png" alt="Play in browser" />
			Play in browser
		</a>
	</h1>
</Menu>
