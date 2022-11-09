const express = require("express")
const app = express();
const WebSocket = require("ws");
Object.assign(global, WebSocket);
const SFS2X = require("sfs2x-api")
app.use(express.json())

app.listen(3000, () => {
    console.log("its running on port 3000")
})

var sfs, zoneName, handler_name, reqParams;

app.get("/", (req, res) => {
    var config = {}
    config.host = req.body.ip;
    config.port = req.body.port;
    zoneName = req.body.zone_name;
    config.zone = zoneName
    config.debug = true;
    console.log("test", config);

    console.log(zoneName);
    reqParams = req.body.req_params
    handler_name = req.body.handler_name

    //create smartfox client instance
    sfs = new SFS2X.SmartFox(config);

    //Add Event Listener
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnectionLost, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError, this);
    sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse, this);

    //Attempt connection
    sfs.connect();
})
function onConnection(event) {
    if (event.success) {
        console.log('connection success');
        sfs.send(new SFS2X.LoginRequest("Shubham", "", null, zoneName))
    }
    else {
        console.log('connection failed')
    }
}

function onConnectionLost(event) {
    console.log("Disconnection occurred; reason is: " + event.reason);
}

function onLogin(evtParams) {
    console.log("Login successfull");
    reqSend()
}

function onLoginError(evtParams) {
    console.log("Login failure: " + evtParams.errorMessage);
}

function reqSend() {
    let params = new SFS2X.SFSObject();
    if (handler_name == "PokerBotMultiPublish") {
        params.putInt("clientId", parseInt(req_params.client_id));
        params.putInt("gameId", parseInt(req_params.game_id));
        params.putUtfString("action", req_params.action);
        params.putUtfString("bot_str", req_params.bot_str);
        params.putUtfString("type", req_params.type);
    }
    else if (handler_name == "CreateAdminRoom") {
        params.putInt("tableId", parseInt(reqParams.tableid));
        params.putUtfString("tableType", reqParams.table_type);
        params.putUtfString("bettingType", reqParams.betting_type);
        params.putUtfString("moneyType", reqParams.money_type);
        params.putUtfString("rakeType", reqParams.rake_type);
        params.putDouble("bootAmt", parseFloat(reqParams.boot_amt));
        params.putDouble("startBuyIn", parseFloat(reqParams.start_buyin));
        params.putDouble("endBuyIn", parseFloat(reqParams.end_buying));
        params.putInt("isGps", parseInt(reqParams.is_gps));
        params.putInt("isIp", parseInt(reqParams.is_ip));
        params.putInt("isBot", parseInt(reqParams.is_bot));
        params.putDouble("rakePer", parseFloat(reqParams.rake_table));
        params.putInt("minPlayer", parseInt(reqParams.min_player));
        params.putInt("maxPlayer", parseInt(reqParams.max_player));
        params.putDouble("dealerCommission", parseFloat(reqParams.rake_table));
        params.putInt("autoFold", parseInt(reqParams.auto_fold));
        params.putInt("aiInterval", parseInt(reqParams.ai_interval));
        params.putDouble("maxPot", parseFloat(reqParams.max_pot));
        params.putDouble("maxChaal", parseFloat(reqParams.max_chaal));
        params.putInt("bettingTimer", parseInt(reqParams.timer_speed));
        params.putInt("ShowCards", parseInt(reqParams.show_cards));
        params.putDouble("admin_percent", parseFloat(reqParams.admin_percent));
        params.putInt("is_owner", parseInt(reqParams.is_owner));
        params.putInt("validity", parseInt(reqParams.validity));
        params.putDouble("owner_rake", parseFloat(reqParams.owner_rake));
        params.putInt("owner_usertype", parseInt(reqParams.owner_usertype));
        params.putInt("affiliate_sharing", parseInt(reqParams.affiliate_sharing));
        params.putInt("owner_id", parseInt(reqParams.owner_id));
        params.putUtfString("owner_username", reqParams.owner_username);
        params.putUtfString("valid_till", reqParams.valid_till);
        params.putInt("is_gamerake", 1);
        params.putInt("staff_level", 4);

        params.putInt("pk_tableId", parseInt(reqParams.gametable_id));
        params.putInt("gameId", parseInt(reqParams.game_id));
        params.putInt("isDefault", parseInt(reqParams.is_default));
        params.putInt("maxTable", parseInt(reqParams.max_table));
        params.putUtfString("gameFormate", reqParams.game_formate);
        params.putUtfString("typeState", reqParams.type_state);
        params.putInt("clientId", parseInt(reqParams.client_id));

         params.putUtfString("tableName", reqParams.tableid);
         params.putInt("bot_time", parseInt(reqParams.bot_time));
         params.putInt("max_bots", parseInt(reqParams.max_bots));
         params.putInt("countdown_interval", reqParams.countdown_interval);
         params.putBool("botautosit", reqParams.botautosit);
    }

    sfs.send(new SFS2X.ExtensionRequest(handler_name, params));
}

function onExtensionResponse(evtParams) {
    console.log(evtParams.params)   //its give parameter
    if (evtParams.cmd == "CreateAdminRoom") {
        console.log("CreateAdminRoom");
        var responseParams = evtParams.params;
        console.log("The publish data is : " + responseParams.get(evtParams.cmd));      //evtParams give handler name
        console.log("Data is ..." + evtParams);
    }
}