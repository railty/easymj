//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var db = require('./utils/db');
var configs = require("./configs");
db.init(configs.mysql());

var configAccountServer = configs.account_server();
var as = require('./account_server/account_server');
as.start(configAccountServer);
var dapi = require('./account_server/dealer_api');
dapi.start(configAccountServer);

var configHallServer = configs.hall_server();

var client_service = require("./hall_server/client_service");
client_service.start(configHallServer);

var room_service = require("./hall_server/room_service");
room_service.start(configHallServer);

var configGameServer = configs.game_server();
var socket_service = require("./majiang_server/socket_service");
socket_service.start(configGameServer);

var http_service = require("./majiang_server/http_service");
http_service.start(configGameServer);
