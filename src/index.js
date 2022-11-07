const express = require("express")
const app = express();
const WebSocket = require("ws");
Object.assign(global, WebSocket);
const SFS2X = require("sfs2x-api");
app.use(express.json());
var sfs, zoneName, req_params, handler_name;
app.get("/", (req, res) => {

    var config = {}
    config.host = req.body.ip;
    config.port = req.body.port;
    zoneName = req.body.zone_name
    config.zone = zoneName;
    config.debug = true;
    console.log("test ", config);

    console.log(zoneName)
    req_params = req.body.req_para
    handler_name = req.body.handler_name
    // console.log(req.body)
    //create smartfox client instance
    sfs = new SFS2X.SmartFox(config);

    //Add Event Listener
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, onConnection, this);
    sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, onConnectionLost, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN, onLogin, this);
    sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, onLoginError, this);
    sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, onExtensionResponse, this);

    //Attempt connection
    sfs.connect();
})
app.listen(3000, () => { console.log("connection successfull with 3000 port"); })
function onConnection(event) {
    if (event.success) {
        console.log('connection success');
        sfs.send(new SFS2X.LoginRequest("Bot", "", null, zoneName));
    }
    else {
        console.log('connection failed');
    }
}

function onConnectionLost(event) {
    console.log("Disconnection occurred; reason is: " + event.reason);
}


function onLogin(evtParams) {
    console.log("Login successful!");
    reqSend()
}

function onLoginError(evtParams) {
    console.log("Login failure: " + evtParams.errorMessage);
}



function reqSend() {

    let params = new SFS2X.SFSObject();

    params.putInt("client_id", parseInt(req_params.client_id));
    params.putInt("game_id", parseInt(req_params.game_ids));
    params.putUtfString("bot_str", req_params.bot_str);
    params.putUtfString("action", req_params.action);

    // params.putUtfString("action",req_params.type_state);
    // params.putUtfString("bot_str",req_params.bot_userarr);
    // params.putUtfString("type",req_params.tournamenttype.toLowerCase());

    sfs.send(new SFS2X.ExtensionRequest(handler_name, params));
}
function onExtensionResponse(evtParams) {
    console.log(evtParams.params);
    if (evtParams.cmd == "LudoBotMultiPublish") {
        console.log("LudoBotMultiPublish")
        var responseParams = evtParams.params;
        console.log("The publish data is : " + responseParams.get(evtParams.cmd));      //evtParams give handler name
        console.log("Data is ..." + evtParams);
    }
}
