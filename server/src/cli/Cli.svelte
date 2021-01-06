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

	function tile(id){
		//筒
		if(id >= 0 && id < 9) return {
			id: id,
			tp: "bing",
			num: id+1,
			icon: `${id+1}b`
		};
		//条
		else if(id >= 9 && id < 18) return {
			id: id,
			tp: "tiao",
			num: id - 9 + 1,
			icon: `${id - 9 + 1}t`
		}
		//万	
		else if(id >= 18 && id < 27) return {
			id: id,
			tp: "wan",
			num: id - 18 + 1,
			icon: `${id - 18 + 1}w`
		}
		//这里改动加上中发白
		else if(id == 27) return {
			id: id,
			tp: "zhong",
			icon: 'zhong'
		}
		else if(id == 28) return {
			id: id,
			tp: "fa",
			icon: 'fa'
		}
		else if(id == 29) return {
			id: id,
			tp: "bai",
			icon: 'bai'
		}
		else if(id == 30) return {
			id: id,
			tp: "east",
			icon: "east",
		}
		else if(id == 31) return {
			id: id,
			tp: "west",
			icon: "west",
		}
		else if(id == 32) return {
			id: id,
			tp: "south",
			icon: "south",
		}
		else if(id == 33) return {
			id: id,
			tp: "north",
			icon: "north",
		}
	}

	let tps = {
		1: "CHUPAI",
		2: "MOPAI",
		3: "PENG",
		4: "GANG",
		5: "HU",
		6: "ZIMO",
		7: "CHI",
	};

	async function getGameInfo(){
		let id = '127.0.0.1:10000';
        var ROOM_PRI_KEY = "~!@#$(*&^%$&";

        var reqdata = {
			game_id: "1607291321167482605"
		};

		let rc = await callServer("GET", "/get_game_info", reqdata);
		gameInfo = JSON.parse(rc);
		gameInfo = gameInfo.gameinfo;
		
		gameInfo.base_info = JSON.parse(gameInfo.base_info);
		gameInfo.action_records = JSON.parse(gameInfo.action_records);
		actions = gameInfo.action_records.reduce((last, cur)=>{
			let l = last[last.length-1];
			if (l.length<3) {l.push(cur)} 
			else{last.push([cur])} 
			return last;
		}, [[]]);
		actions = actions.map((a)=>{
			return {
				seat: a[0],
				tp: tps[a[1]],
				tile: tile(a[2])
			}
		});
		console.log(actions);


		mjs = gameInfo.base_info.mahjongs.map((id, idx)=>{
			return tile(id);
		});

		for (let i=0; i<=13*4;i++) mjs[i].used = true;

		console.log(mjs);
		seats = gameInfo.base_info.game_seats;
		seats = seats.map((seat)=>{
			if (seat.length>13){
				let s = seat.slice(0, 13);
				s = s.sort((a, b)=>{return a-b});
				seat = [ ... s, seat[13]];
			}
			else{
				seat = seat.sort((a, b)=>{return a-b});
			}
			
			seat = seat.map((id)=>{return tile(id)});
			return seat;
		});
		console.log(gameInfo);
		console.log(seats);
	}
	let gameInfo = null;
	let mjs = [];
	let seats = [[],[],[],[]];
	let actions = [];

	let name = "xxxx";

	$: tiles = 	mjs.reduce((last, cur)=>{
			let l=last[last.length-1];
			if (l.length<2*17) {l.push(cur)} 
			else{last.push([cur])} 
			return last;
		}, [[]]);

	let lastAction;
	function next(){
		let action = actions.shift();
		if (!action) return 0;
		if (action.tp=="CHUPAI"){
			let seat = seats[action.seat];
			let i = seat.findIndex((e)=>{
				return e.id == action.tile.id;
			});
			console.log(i);
			seat.splice(i, 1);
			seat = seat.sort((a, b)=>{return a.id-b.id});

			seats = seats;
			discardSeats[action.seat].push(action.tile);
			discardSeats = discardSeats;
		}
		else if (action.tp=="MOPAI"){
			let i;
			for (i=0; i<mjs.length; i++){
				if (!(mjs[i].used)) {
					break;
				}
			}
			//should be same
			//mjs[i].id == action.tile.id
			mjs[i].used = true;

			seats[action.seat].push(action.tile);
			seats = seats;
		}
		else if (action.tp=="PENG"){
			console.log("peng");
			let lastCard = discardSeats[lastAction.seat].pop();
			let seat = seats[action.seat];
			let i = seat.findIndex((e)=>e.id==lastCard.id);
			let card1 = seat.splice(i, 1);
			i = seat.findIndex((e)=>e.id==lastCard.id);
			let card2 = seat.splice(i, 1);
			showSeats[action.seat].push([lastCard, card1[0], card2[0]]);
			showSeats = showSeats;
			discardSeats = discardSeats;
			seats = seats;
		}
		else if (action.tp=="GANG"){
			console.log("gang");
			if (lastAction.seat == action.seat) { //self, an gang or xu gang
			}
			else{	//normal gang
				let lastCard = discardSeats[lastAction.seat].pop();
				let seat = seats[action.seat];
				let i = seat.findIndex((e)=>e.id==lastCard.id);
				let card1 = seat.splice(i, 1);
				i = seat.findIndex((e)=>e.id==lastCard.id);
				let card2 = seat.splice(i, 1);
				i = seat.findIndex((e)=>e.id==lastCard.id);
				let card3 = seat.splice(i, 1);
				showSeats[action.seat].push([lastCard, card1[0], card2[0], card3[0]]);
			}

			//after gang, it it his turn to mo pai again, a regualr mo pai from begining, not the end.

			showSeats = showSeats;
			discardSeats = discardSeats;
			seats = seats;
		}
		else if (action.tp=="HU"){
			console.log("hu");
			let lastCard = discardSeats[lastAction.seat].pop();
			let seat = seats[action.seat];
			seat.push(lastCard);
			
			showSeats = showSeats;
			discardSeats = discardSeats;
			seats = seats;
		}
		else if (action.tp=="ZIMO"){
			console.log("zimo");
			
			showSeats = showSeats;
			discardSeats = discardSeats;
			seats = seats;
		}
		else{
			console.log(`unknow action tp: ${action.tp}`);
		}
		lastAction = action;

		return 1;
	}

	function autoPlay(){
		let proc = setInterval(()=>{
			if (next()==0) clearInterval(proc);
		}, 500);
	}
	let discardSeats = [[],[],[],[]];
	let showSeats = [[],[],[],[]];

	let th = "h-4/5";	//total height
	let tw = "w-4/5";	//total width

	let h = "h-1/5";	//height of t and b player area
	let w = "w-1/5";	//width of l and r player area

</script>
<button on:click={setup}>Setup2</button>
<button on:click={send}>Send</button>
<button on:click={getServerInfo}>Get Server Info</button>
<button on:click={getGameInfo}>Get Game Info</button>
<button on:click={next}>Next</button>
<button on:click={autoPlay}>AutoPlay</button>

	<div class="flex flex-col {th} {tw} border-solid border-blue-400 border-2">
		<div id="t" class="flex flex-row {h} border-solid border-blue-400 border-2">

			<div id="tl" class="flex {w} border-solid border-blue-400 border-2">
				tl
			</div>
	
			<div id="tm" class="flex flex-grow border-solid border-blue-400 border-2">
				{#each seats[0] as m}
					<div class="">
						<div class="tile-t tile-t-{m.icon}"></div>
					</div>
				{/each}			
				<div class="tile-t tile-t-back"></div>
			</div>
			
			<div id="tr" class="flex {w} border-solid border-blue-400 border-2">
				tr
			</div>
		</div>

		<div id="m" class="flex flex-grow border-solid border-blue-400 border-2">
			<div id="ml" class="flex flex-col {w} border-solid border-blue-400 border-2">
				{#each seats[1] as m}
					<div class="">
						<div class="tile-l tile-l-{m.icon}"></div>
					</div>
				{/each}			
			</div>
	
			<div id="mm" class="flex flex-grow border-solid border-blue-400 border-2">
				<table style="background-color: indigo;">
					{#each tiles as mj}
						<tr>
							{#each mj as m}
								<td class="tile-t tile-t-{m.icon}" style={m.used ? "opacity:0.15" : "opacity:1"}></td>
							{/each}			
						</tr>
					{/each}
				</table>
			</div>
			
			<div id="mr" class="flex flex-col {w} border-solid border-blue-400 border-2">
				{#each seats[3] as m}
					<div class="">
						<div class="tile-r tile-r-{m.icon}"></div>
					</div>
				{/each}			
			</div>
		</div>
		
		<div id="b" class="flex {h} border-solid border-blue-400 border-2">
			<div id="bl" class="flex {w} border-solid border-blue-400 border-2">
				bl
			</div>
	
			<div id="bm" class="flex flex-grow border-solid border-blue-400 border-2">
				{#each seats[2] as m}
					<div class="">
						<div class="tile-b tile-b-{m.icon}"></div>
					</div>
				{/each}			
			</div>
			
			<div id="br" class="flex {w} border-solid border-blue-400 border-2">
				br
			</div>
		</div>
	</div>


<!--

<div>
	<table style="background-color: indigo;">
	{#each tiles as mj}
		<tr>
			{#each mj as m}
			<td class="sprite sprite-{m.icon}" style={m.used ? "opacity:0.15" : "opacity:1"}></td>
			{/each}			
		</tr>
	{/each}
	</table>
</div>

<div>
	<table>
		{#each seats as seat, idx}
		<tr>
			{#each seat as m}
				<td class="sprite sprite-{m.icon}"></td>
			{/each}			
		</tr>
		<tr>
			{#each showSeats[idx] as ms}
				{#each ms as m}
					<td class="sprite sprite-{m.icon}"></td>
				{/each}	
				<td >|</td>
			{/each}
		</tr>
		<tr>
			{#each discardSeats[idx] as m}
				<td class="sprite sprite-{m.icon}"></td>
			{/each}			
		</tr>
		{/each}
	</table>
</div>

<hr/>
<hr/>

<div class="flex flex-row p-10">
	{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n}
		<div class="p-10 bottom-sprite bottom-sprite-{n}-tiao"></div>
	{/each}
</div>	
	<tr>
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n}
			<td class="bottom-sprite bottom-sprite-{n}-bing"></td>
		{/each}
	</tr>
	<tr>
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n}
			<td class="bottom-sprite bottom-sprite-{n}-wan"></td>
		{/each}
	</tr>

<div class="flex flex-row">
	{#each ['east', 'west', 'south', 'north', 'zhong', 'fa', 'bai'] as n}
		<div class="bottom-sprite bottom-sprite-{n}"></div>
	{/each}
</div>

-->	

<style type="text/scss">
	* {
		box-sizing: border-box;
	}
</style>
