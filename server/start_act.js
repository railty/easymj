//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var db = require('./utils/db');
var configs = require("./configs");
db.init(configs.mysql());

var configAccountServer = configs.account_server();
var as = require('./account_server/account_server');
as.start(configAccountServer);
var dapi = require('./account_server/dealer_api');
dapi.start(configAccountServer);

