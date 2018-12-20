'use strict';

const { Client, BasicAuthInterceptor } = require('camunda-external-task-client-js');
const { util } = require('camunda-external-task-client-js/lib/__internal/utils');
const { intOrDefault } = require('./lib');
const clientLog = require('./clientLog');

function init(options = {}){
    try{
        let config, //camunda-external-task-client config
            interceptors, use;

        //Use basic auth if needed for Camunda rest engine
        if(process.env.AUTH === 'true'){
            let basicAuth = new BasicAuthInterceptor({
                username: process.env.USER,
                password: process.env.PASS
            });

            interceptors = interceptors || [];
            interceptors.push(basicAuth);
        }

        if(process.env.LOG_CAMUNDA === 'true'){
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
            interceptors = interceptors || [];
            interceptors = interceptors.concat(options.interceptors);
        }

        config = {
            baseUrl: process.env.BASE_URL,
            maxTasks: intOrDefault(process.env.MAX_TASK, 10),
            asyncResponseTimeout: intOrDefault(process.env.ASYNC_RESPONSE_TIMEOUT, 10000),
            interval: intOrDefault(process.env.INTERVAL, 300),
            lockDuration: intOrDefault(process.env.LOCK_DURATION, 50000),
            autoPoll: (process.env.AUTO_POLL === 'true'),
            interceptors: interceptors,
            use: use
        };

        //Set worker id if specified
        if(process.env.WORKER_ID){
            config.workerId = process.env.WORKER_ID;
        }

        return new Client(config);
    } catch(ex){
        throw ex;
    }
}

module.exports = { init };