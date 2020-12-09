//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var db = require('./utils/db');
var configs = require("./configs");
db.init(configs.mysql());

var configGameServer = configs.game_server();
var socket_service = require("./majiang_server/socket_service");
socket_service.start(configGameServer);

var http_service = require("./majiang_server/http_service");
http_service.start(configGameServer);
