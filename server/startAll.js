var db = require('./utils/db');
var configs = require("./configs_local");
db.init(configs.mysql());

var configAccountServer = configs.account_server();
var as = require('./account_server/account_server');
as.start(configAccountServer);
var dapi = require('./account_server/dealer_api');
dapi.start(configAccountServer);


var configHallServer = configs.hall_server();
var client_service = require("./hall_Server/client_service");
var room_service = require("./hall_Server/room_service");
client_service.start(configHallServer);
room_service.start(configHallServer);


var http_service = require("./majiang_server/http_service");
var socket_service = require("./majiang_server/socket_service");
var configGameServer = configs.game_server();
http_service.start(configGameServer);
socket_service.start(configGameServer);
