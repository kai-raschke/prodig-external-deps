'use strict';

const logParent = require('./log'),
      log       = logParent.child({component: 'camunda-external-client'}),
      path      = require('path');
const clientLog = require('./clientLog');
const { Client, BasicAuthInterceptor } = require('camunda-external-task-client-js');
const { util } = require('camunda-external-task-client-js/lib/__internal/utils');

function init(options){
    options = options || {};
    let config, //camunda-external-task-client config
        interceptors = [],
        use = [clientLog], //Always use clientLog
        MAX_TASK, ASYNC_RESPONSE_TIMEOUT, AUTH, INTERVAL, AUTO_POLL, LOCK_DURATION;

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
        process.env = Object.assign(process.env, options.env);
    }

    //Parsing environment variables which default to string but need a different type
    try{
        MAX_TASK = (isNaN(parseInt(process.env.MAX_TASK)) ? undefined : parseInt(process.env.MAX_TASK));
        ASYNC_RESPONSE_TIMEOUT = (isNaN(parseInt(process.env.ASYNC_RESPONSE_TIMEOUT)) ? undefined : parseInt(process.env.ASYNC_RESPONSE_TIMEOUT));
        INTERVAL = (isNaN(parseInt(process.env.INTERVAL)) ? 300 : parseInt(process.env.INTERVAL));
        LOCK_DURATION = (isNaN(parseInt(process.env.LOCK_DURATION)) ? 50000 : parseInt(process.env.LOCK_DURATION));
        AUTH = (process.env.AUTH === 'true');
        AUTO_POLL = (process.env.AUTO_POLL === 'true');
    } catch(ex){
        log.error(ex);
    }

    //Use basic auth if needed for Camunda rest engine
    if(AUTH === true){
        let basicAuth = new BasicAuthInterceptor({
            username: process.env.USER,
            password: process.env.PASS
        });

        interceptors.push(basicAuth);
    }

    //Add optional interceptors
    if(
        options.interceptors &&
        !util.isFunction(options.interceptors) &&
        !util.isArrayOfFunctions(options.interceptors)
    ){
        interceptors = interceptors.concat(options.interceptors);
    }

    //Add optional middleware for use
    if(
        options.use &&
        !util.isFunction(options.use) &&
        !util.isArrayOfFunctions(options.use)
    ){
        use = use.concat(options.use);
    }

    config = {
        baseUrl: process.env.BASE_URL,
        maxTasks: MAX_TASK,
        asyncResponseTimeout: ASYNC_RESPONSE_TIMEOUT,
        interval: INTERVAL,
        lockDuration: LOCK_DURATION,
        autoPoll: AUTO_POLL,
        interceptors: (interceptors.length > 0 ? interceptors : undefined),
        use: use
    };

    //Set worker id if specified
    if(process.env.WORKER_ID){
        config.workerId = process.env.WORKER_ID;
    }

    return new Client(config);
}

module.exports = { init };