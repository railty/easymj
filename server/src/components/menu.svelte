<script>
	import { onMount} from 'svelte';
	
	onMount(async () => {
	});

	function openMenu(){
		menuOpen = !menuOpen;
	}
	function click(menu){
		selectedMenu = menu;
	}
	let menuOpen = false;
	export let selectedMenu = 'Home';
</script>

<div>
	<nav class="bg-gray-800">
	  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
		  <div class="flex items-center">
			<div class="flex-shrink-0">
			  <img class="h-16 w-16" src="/css/logo.png" alt="fa">
			</div>
			<div class="hidden md:block">
			  <div class="ml-10 flex items-baseline space-x-4">
				<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
				<a on:click={()=>{click('Home')}} href="#/home" class="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
  				<a href="/privacy.html" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Privacy Policy</a>
  				<a on:click={()=>{click('Contact US')}} href="#/contact" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact US</a>
  			  </div>
			</div>
		  </div>
		  <div class="-mr-2 flex md:hidden">
			<!-- Mobile menu button -->
			<button on:click={openMenu} class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
			  <span class="sr-only">Open main menu</span>
			  <!--
				Heroicon name: menu
  
				Menu open: "hidden", Menu closed: "block"
			  -->
			  <svg class="{menuOpen ? 'hidden' : 'block'} h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			  </svg>
			  <!--
				Heroicon name: x
  
				Menu open: "block", Menu closed: "hidden"
			  -->
			  <svg class="{menuOpen ? 'block' : 'hidden'} h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			  </svg>
			</button>
		  </div>
		</div>
	  </div>
  
	  <!--
		Mobile menu, toggle classes based on menu state.
  
		Open: "block", closed: "hidden"
	  -->
	  <div class="{menuOpen ? 'block': 'hidden'} md:hidden">
		<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
		  <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
		  <a on:click={()=>{click('Home')}} href="#/home" class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
		  <a href="/privacy.html" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Privacy Policy</a>
		  <a on:click={()=>{click('Contact US')}} href="#/contact" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contact Us</a>
		</div>
	  </div>
	</nav>
  
	<header class="bg-white shadow">
	  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
		<h1 class="text-3xl font-bold leading-tight text-gray-900">
		  {selectedMenu}
		</h1>
	  </div>
	</header>
	<main>
	  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<slot></slot>
	  </div>
	</main>
</div>
