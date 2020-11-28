<script>
	import { onMount} from 'svelte';
	import md5 from "crypto-js/md5";
	import io from 'socket.io-client';	//bug in the package
	//import io from "socket.io-client/dist/socket.io.js";
	import { callServer } from '../components/utils';
	
	onMount(async () => {
		console.log("on mount");
	});

	async function getServerInfo(){
		let id = '127.0.0.1:10000';
        var ROOM_PRI_KEY = "~!@#$(*&^%$&";

        var reqdata = {
			serverid:id,
			sign:md5(id+ROOM_PRI_KEY)
		};

		let rc = await callServer("GET", "/get_server_info", reqdata);
		console.log(rc);
	}

	let sio;

	async function send(){
		sio.emit("game_ping", "game_ping");
	}
	async function setup(){
		let opts = {
			'reconnection':true,
			'force new connection': true,
			'transports':['websocket', 'polling']
		}
		let ip = "127.0.0.1:10000";
		
		console.log(io);

		sio = io.connect(ip, opts);

		console.log(sio);
		
		sio.on('disconnect',function(data){
			console.log("disconnect");
			sio.connected = false;
			sio.disconnect();
			sio = null;
		});

		sio.on('game_pong',function(){
			console.log('game_pong');
		});
				
	}

</script>
<button on:click={setup}>Setup2</button>
<button on:click={send}>Send</button>
<button on:click={getServerInfo}>Get Server Info</button>
<div>
	111111111111
</div>

<hr />

<style>
	* {
		box-sizing: border-box;
	}
</style>