'use strict';
const path      = require('path');

function init(options){
    //If the app is not started by pm2, we will try to inject the env variables from app.json
    if(!process.env.NODE_ENV){
        try{
            let appJson = require(path.resolve(__dirname, '..', '..', '..') + path.sep + 'app.json'); //Module within node_modules/org.prodig.external.extras
            let env = appJson.apps[0].env;
            process.env = Object.assign(process.env, env);
        } catch(ex){ console.log(ex); }
    }
    else{
        //The app can be started without env variables through options, options will be pushed to global process.env
        options = options || {};
        process.env = Object.assign(process.env, options);
    }

    const client = require('./client').init(options);
    const log = require('./log');
    const lib = require('./lib');
    const gray = require('./gray');

    return { client, log, lib, gray };
}

module.exports = init;