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
			icon: `${id+1}-bing`
		};
		//条
		else if(id >= 9 && id < 18) return {
			id: id,
			tp: "tiao",
			num: id - 9 + 1,
			icon: `${id - 9 + 1}-tiao`
		}
		//万	
		else if(id >= 18 && id < 27) return {
			id: id,
			tp: "wan",
			num: id - 18 + 1,
			icon: `${id - 18 + 1}-wan`
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
	let seats = [];
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

</script>
<button on:click={setup}>Setup2</button>
<button on:click={send}>Send</button>
<button on:click={getServerInfo}>Get Server Info</button>
<button on:click={getGameInfo}>Get Game Info</button>
<button on:click={next}>Next</button>
<button on:click={autoPlay}>AutoPlay</button>
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

<table>
	<tr>
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n}
			<td class="sprite sprite-{n}-tiao"></td>
		{/each}
	</tr>
	<tr>
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n}
			<td class="sprite sprite-{n}-bing"></td>
		{/each}
	</tr>
	<tr>
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n}
			<td class="sprite sprite-{n}-wan"></td>
		{/each}
	</tr>
	<tr>
		{#each ['east', 'west', 'south', 'north', 'zhong', 'fa', 'bai'] as n}
			<td class="sprite sprite-{n}"></td>
		{/each}
	</tr>	
</table>



<style type="text/scss">
	* {
		box-sizing: border-box;
	}

	$z: 1;
	$width:55px;
	$height:84px;
	$w: $width/$z;
	$h: $height/$z;
	.sprite {
		background-image: url(../css/tiles.png);
		background-size: (512/$z)+0px (512/$z)+0px;
		background-repeat: no-repeat;
		width: $w;
		height: $h;
		max-width: 100%;
	}	

	$tiaos:
		"1" -0*$w -1*$h,
		"2" -0*$w -2*$h,
		"3" -0*$w -3*$h,
		"4" -0*$w -4*$h,
		"5" -0*$w -5*$h,
		"6" -1*$w -0*$h,
		"7" -1*$w -1*$h,
		"8" -1*$w -2*$h,
		"9" -1*$w -3*$h;

	@each $n, $x, $y in $tiaos {
    	.sprite-#{$n}-tiao {
        	background-position: #{$x} #{$y}
    	}
	}

	$bings:
		"1" -3*$w -1*$h,
		"2" -3*$w -2*$h,
		"3" -3*$w -3*$h,
		"4" -3*$w -4*$h,
		"5" -3*$w -5*$h,
		"6" -4*$w -0*$h,
		"7" -4*$w -1*$h,
		"8" -4*$w -2*$h,
		"9" -4*$w -3*$h;

	@each $n, $x, $y in $bings {
    	.sprite-#{$n}-bing {
        	background-position: #{$x} #{$y}
    	}
	}

	$wans:
		"1" -1*$w -4*$h,
		"2" -1*$w -5*$h,
		"3" -2*$w -0*$h,
		"4" -2*$w -1*$h,
		"5" -2*$w -2*$h,
		"6" -2*$w -3*$h,
		"7" -2*$w -4*$h,
		"8" -2*$w -5*$h,
		"9" -3*$w -0*$h;

	@each $n, $x, $y in $wans {
    	.sprite-#{$n}-wan {
        	background-position: #{$x} #{$y}
    	}
	}

	.sprite-east {
       	background-position: -5*$w -2*$h
    }
	.sprite-west {
       	background-position: -5*$w -5*$h
    }
	.sprite-south {
       	background-position: -5*$w -4*$h
    }
	.sprite-north {
       	background-position: -5*$w -3*$h
    }
	.sprite-zhong {
       	background-position: -5*$w -0*$h
    }
	.sprite-fa {
       	background-position: -4*$w -4*$h;
    }
	.sprite-bai {
       	background-position: -5*$w -1*$h;
		//transform: rotateZ(90deg);
    }

</style>
