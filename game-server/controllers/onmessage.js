let root = require("app-root-path");

let { pipe } = require(`${root}/helpers/utils`);
let { rejectWs } = require(`${root}/helpers/websocket`);
let {
    cleanUTFString,
    sanitizeHTMLString
} = require(`${root}/helpers/stringSanitization`);

let types = {
    chat: require("./actions/chat"),
    fire: require("./actions/fire"),
    place: require("./actions/place"),
    default: () => ""
};

function handleMessage(type) {
    if (types.hasOwnProperty(type)) return types[type];
    else return types["default"];
}

function onmessage(msg, ws, wss, room) {
    console.log(`recieved: ${msg}`);

    try {
        msg = JSON.parse(msg);
    } catch (errr) {
        return rejectWs(ws);
    }

    if (!msg.type || !msg.msg) return rejectWs(ws);

    // Sanitize message
    msg.msg = pipe([cleanUTFString, sanitizeHTMLString])(msg.msg);

    return handleMessage(msg.type)(msg.msg, ws, wss, room);
}

module.exports = onmessage;
