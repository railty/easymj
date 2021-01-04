<script>
	import { onMount} from 'svelte';
	import Router from 'svelte-spa-router';

	import Home from '../components/home.svelte';
	import ContactUs from '../components/contactUs.svelte';

	const routes = {
	'/': Home,
    '/Home': Home,
    '/Contact': ContactUs,
	}

	onMount(async () => {
		console.log("on mount");
	});

	function openMenu(){
		menuOpen = !menuOpen;
	}
	let menuOpen = false;

	let selectedMenu;
</script>

<Router {routes}/>

<div id="foo" />

<style>
#foo{
	background-color: aqua;
}
</style>
