'use strict';

const { Client, BasicAuthInterceptor } = require('camunda-external-task-client-js');
const { util } = require('camunda-external-task-client-js/lib/__internal/utils');
const logParent = require('./log'),
      log       = logParent.child({component: 'camunda-external-client'});
const clientLog = require('./clientLog');

function init(options){
    options = options || {};
    let config, //camunda-external-task-client config
        interceptors = [],
        use,
        MAX_TASK, ASYNC_RESPONSE_TIMEOUT, AUTH, INTERVAL, AUTO_POLL, LOCK_DURATION, LOG_CAMUNDA, LOG_FILE, LOG_GRAYLOG;

    //Parsing environment variables which default to string but need a different type
    try{
        MAX_TASK = (isNaN(parseInt(process.env.MAX_TASK)) ? undefined : parseInt(process.env.MAX_TASK));
        ASYNC_RESPONSE_TIMEOUT = (isNaN(parseInt(process.env.ASYNC_RESPONSE_TIMEOUT)) ? undefined : parseInt(process.env.ASYNC_RESPONSE_TIMEOUT));
        INTERVAL = (isNaN(parseInt(process.env.INTERVAL)) ? 300 : parseInt(process.env.INTERVAL));
        LOCK_DURATION = (isNaN(parseInt(process.env.LOCK_DURATION)) ? 50000 : parseInt(process.env.LOCK_DURATION));
        AUTH = (process.env.AUTH === 'true');
        AUTO_POLL = (process.env.AUTO_POLL === 'true');
        LOG_CAMUNDA = (process.env.LOG_CAMUNDA === 'true');
        LOG_FILE = (process.env.LOG_FILE === 'false' ? false : true); //use bunyan file log if not explicit turned off
        LOG_GRAYLOG = (process.env.LOG_GRAYLOG === 'true');
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

    if(LOG_CAMUNDA){
        use = use || [];
        use = use.concat([clientLog]);
    }

    //Add optional middleware for use
    if(
        options.use &&
        !util.isFunction(options.use) &&
        !util.isArrayOfFunctions(options.use)
    ){
        use = use || [];
        use = use.concat(options.use);
    }

    //Add optional interceptors
    if(
        options.interceptors &&
        !util.isFunction(options.interceptors) &&
        !util.isArrayOfFunctions(options.interceptors)
    ){
        interceptors = interceptors.concat(options.interceptors);
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