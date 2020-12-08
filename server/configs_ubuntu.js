var ACT_EXT_IP = 'act.game.com';
var ACT_INT_IP = "localhost";
var ACT_EXT_PORT = 9000;
var ACT_INT_PORT = 8000;

var CLIENT_EXT_IP = "hall.game.com";
var CLIENT_INT_IP = "localhost";
var CLIENT_EXT_PORT = 9001;
var CLIENT_INT_PORT = 8001;

var ROOM_EXT_IP = "hall.game.com";
var ROOM_INT_IP = "localhost";
var ROOM_EXT_PORT = 9002;
var ROOM_INT_PORT = 8002;

var HTTP_EXT_IP = "web.game.com";
var HTTP_INT_IP = "localhost";
var HTTP_EXT_PORT = 443;
var HTTP_INT_PORT = 8003;

var SOCKET_EXT_IP = "web.game.com";
var SOCKET_INT_IP = "localhost";
var SOCKET_EXT_PORT = 9004;
var SOCKET_INT_PORT = 8004;

var ACCOUNT_PRI_KEY = "f865f224a12841fdf92a4d7ce2e94972";
var ROOM_PRI_KEY = "10e8b80ad70aade16c8c6c5a53eac167";

var LOCAL_IP = 'localhost';

//CREATE USER 'fish'@'web.game.com' IDENTIFIED WITH mysql_native_password BY 'fisher';
//GRANT ALL ON fish.* TO 'fish'@'web.game.com';
//flush privileges;
exports.mysql = function(){
	return {
		HOST:'192.168.134.1',
		USER:'fish',
		PSWD:'fisher',
		DB:'fish',
		PORT:3306,
	}
}

//账号服配置
exports.account_server = function(){
	return {
		ACT_EXT_IP:ACT_EXT_IP,
		ACT_INT_IP:ACT_INT_IP,
		ACT_EXT_PORT:ACT_EXT_PORT,
		ACT_INT_PORT:ACT_INT_PORT,

		CLIENT_EXT_IP:CLIENT_EXT_IP,
		CLIENT_INT_IP:CLIENT_INT_IP,
		CLIENT_EXT_PORT:CLIENT_EXT_PORT,
		CLIENT_INT_PORT:CLIENT_INT_PORT,

		ACCOUNT_PRI_KEY:ACCOUNT_PRI_KEY,
		//
		DEALDER_API_IP:LOCAL_IP,
		DEALDER_API_PORT:12581,
		VERSION:'20161227',
		APP_WEB:'http://fir.im/2f17',
	};
};

//大厅服配置
exports.hall_server = function(){
	return {
		CLIENT_EXT_IP:CLIENT_EXT_IP,
		CLIENT_INT_IP:CLIENT_INT_IP,
		CLIENT_EXT_PORT:CLIENT_EXT_PORT,
		CLIENT_INT_PORT:CLIENT_INT_PORT,

		ROOM_INT_IP:ROOM_INT_IP,
		ROOM_EXT_IP:ROOM_EXT_IP,
		ROOM_INT_PORT:ROOM_INT_PORT,
		ROOM_EXT_PORT:ROOM_EXT_PORT,

		ACCOUNT_PRI_KEY:ACCOUNT_PRI_KEY,
		ROOM_PRI_KEY:ROOM_PRI_KEY
	};
};

	//游戏服配置
exports.game_server = function(){
	return {
		SERVER_ID:`${SOCKET_EXT_IP}:${SOCKET_EXT_PORT}`,

		//暴露给大厅服的HTTP端口号
		HTTP_INT_IP: HTTP_INT_IP,
		HTTP_INT_PORT: HTTP_INT_PORT,
		HTTP_EXT_IP: HTTP_EXT_IP,
		HTTP_EXT_PORT: HTTP_EXT_PORT,

		SOCKET_EXT_IP: SOCKET_EXT_IP,
		SOCKET_INT_IP: SOCKET_INT_IP,
		SOCKET_EXT_PORT: SOCKET_EXT_PORT,
		SOCKET_INT_PORT: SOCKET_INT_PORT,
		
		//HTTP TICK的间隔时间，用于向大厅服汇报情况
		HTTP_TICK_TIME:5000,
		//大厅服IP
		CLIENT_EXT_IP:CLIENT_EXT_IP,
		CLIENT_EXT_PORT:CLIENT_EXT_PORT,
		
		ROOM_INT_IP:ROOM_INT_IP,
		ROOM_INT_PORT:ROOM_INT_PORT,
		ROOM_EXT_IP:ROOM_EXT_IP,
		ROOM_EXT_PORT:ROOM_EXT_PORT,

		VERSION:'20161227',
		APP_WEB:'http://fir.im/2f17',

		//与大厅服协商好的通信加密KEY
		ROOM_PRI_KEY:ROOM_PRI_KEY,

		//暴露给客户端的接口
		SOCKET_INT_IP: SOCKET_INT_IP,
		SOCKET_INT_PORT: SOCKET_INT_PORT
	};
};
