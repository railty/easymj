//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var db = require('./utils/db');
var configs = require("./configs");
db.init(configs.mysql());

var configHallServer = configs.hall_server();

var client_service = require("./hall_server/client_service");
client_service.start(configHallServer);

var room_service = require("./hall_server/room_service");
room_service.start(configHallServer);

