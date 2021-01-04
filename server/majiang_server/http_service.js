var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require('../utils/http');
var roomMgr = require("./roommgr");
var userMgr = require("./usermgr");
var tokenMgr = require("./tokenmgr");

var app = express();
var config = null;

var serverIp = "";

//测试
app.use(express.static(__dirname+"/../../public"));
app.post('/contact',function(req,res){
	let data = req.query;

	db.create_ticket(data.name, data.email, data.message, function(ret) {
		if(ret){
			data.code = 'ok';
			data.resp = `
			<li>Your message has been received.</li>
			<li>Thanks for your interest</li>
			<li>An email with auto reply will be send to you shortly</li>
			<li>We will contact you via email once when have a resolution</li>`;
		}
		else{
			data.code = 'error';
			data.resp = `unexpected error, please try again later`;
		}
		res.send(JSON.stringify(data));
	});	

});

app.all('*', function(req, res, next) {
	console.log(req.originalUrl);

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.get('/get_server_info',function(req,res){
	var serverId = req.query.serverid;
	var sign = req.query.sign;
	console.log(serverId);
	console.log(sign);
	if(serverId  != config.SERVER_ID || sign == null){
		http.send(res,1,"invalid parameters");
		return;
	}

	var md5 = crypto.md5(serverId + config.ROOM_PRI_KEY);
	if(md5 != sign){
		http.send(res,1,"sign check failed.");
		return;
	}

	var locations = roomMgr.getUserLocations();
	var arr = [];
	for(var userId in locations){
		var roomId = locations[userId].roomId;
		arr.push(userId);
		arr.push(roomId);
	}
	http.send(res,0,"ok",{userroominfo:arr});
});

app.get('/get_game_info',function(req,res){
	let room_uuid = req.query.game_id;
	console.log(room_uuid);

	db.get_game(room_uuid, function(ret) {

		if(ret){
			http.send(res,0,"ok",{gameinfo: ret});
		}
		else{
			http.send(res,0,"error",{gameinfo:"error"});
		}
	});
});

app.get('/create_room',function(req,res){
	var userId = parseInt(req.query.userid);
	var sign = req.query.sign;
	var gems = req.query.gems;
	var conf = req.query.conf;
	if(userId == null || sign == null || conf == null){
		http.send(res,1,"invalid parameters");
		return;
	}

	var md5 = crypto.md5(userId + conf + gems + config.ROOM_PRI_KEY);
	if(md5 != req.query.sign){
		console.log("invalid reuqest.");
		http.send(res,1,"sign check failed.");
		return;
	}

	conf = JSON.parse(conf);
	roomMgr.createRoom(userId,conf,gems,serverIp,config.SOCKET_EXT_PORT,function(errcode,roomId){
		if(errcode != 0 || roomId == null){
			http.send(res,errcode,"create failed.");
			return;	
		}
		else{
			http.send(res,0,"ok",{roomid:roomId});			
		}
	});
});

app.get('/enter_room',function(req,res){
	var userId = parseInt(req.query.userid);
	var name = req.query.name;
	var roomId = req.query.roomid;
	var sign = req.query.sign;
	if(userId == null || roomId == null || sign == null){
		http.send(res,1,"invalid parameters");
		return;
	}

	var md5 = crypto.md5(userId + name + roomId + config.ROOM_PRI_KEY);
	console.log(req.query);
	console.log(md5);
	if(md5 != sign){
		http.send(res,2,"sign check failed.");
		return;
	}

	//安排玩家坐下
	roomMgr.enterRoom(roomId,userId,name,function(ret){
		if(ret != 0){
			if(ret == 1){
				http.send(res,4,"room is full.");
			}
			else if(ret == 2){
				http.send(res,3,"can't find room.");
			}	
			return;		
		}

		var token = tokenMgr.createToken(userId,5000);
		http.send(res,0,"ok",{token:token});
	});
});

app.get('/ping',function(req,res){
	var sign = req.query.sign;
	var md5 = crypto.md5(config.ROOM_PRI_KEY);
	if(md5 != sign){
		return;
	}
	http.send(res,0,"pong");
});

app.get('/is_room_runing',function(req,res){
	var roomId = req.query.roomid;
	var sign = req.query.sign;
	if(roomId == null || sign == null){
		http.send(res,1,"invalid parameters");
		return;
	}

	var md5 = crypto.md5(roomId + config.ROOM_PRI_KEY);
	if(md5 != sign){
		http.send(res,2,"sign check failed.");
		return;
	}
	
	//var roomInfo = roomMgr.getRoom(roomId);
	http.send(res,0,"ok",{runing:true});
});

var gameServerInfo = null;
var lastTickTime = 0;

//向大厅服定时心跳
function update(){
	if(lastTickTime + config.HTTP_TICK_TIME < Date.now()){
		lastTickTime = Date.now();
		gameServerInfo.load = roomMgr.getTotalRooms();
		
//		http.get(config.ROOM_INT_IP,config.ROOM_INT_PORT,"/register_gs",gameServerInfo,function(ret,data){
		http.get(config.ROOM_EXT_IP,config.ROOM_EXT_PORT,"/register_gs",gameServerInfo,function(ret,data){
			if(ret == true){
				if(data.errcode != 0){
					console.log(data.errmsg);
				}
				
				if(data.ip != null){
					serverIp = data.ip;
				}
			}
			else{
				//
				lastTickTime = 0;
			}
		}, config.HTTPS);
		//shawn force it to be true

		var mem = process.memoryUsage();
		var format = function(bytes) {  
              return (bytes/1024/1024).toFixed(2)+'MB';  
        }; 
		//console.log('Process: heapTotal '+format(mem.heapTotal) + ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss));
	}
}

exports.start = function($config){
	config = $config;

	//
	gameServerInfo = {
		id:config.SERVER_ID,
		clientip:config.SOCKET_EXT_IP,
		clientport:config.SOCKET_EXT_PORT,
		httpIP:config.HTTP_EXT_IP,
		httpPort:config.HTTP_EXT_PORT,
		load:roomMgr.getTotalRooms(),
	};

	setInterval(update,1000);
	app.listen(config.HTTP_INT_PORT,config.HTTP_INT_IP);
	console.log("game http server is listening on " + config.HTTP_INT_IP + ":" + config.HTTP_INT_PORT);
};
