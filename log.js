'use strict';
const bunyan = require('bunyan'),
    path = require('path'),
    {mkdirSync, existsSync} = require('fs');
const { intOrDefault } = require('./lib');
let logger;

try{
    //Try to get parents app name
    let pckg;
    let parentPackage = path.join(__dirname, '../../../package.json');
    let parentPackageExists = existsSync(parentPackage);
    if(parentPackageExists)
        pckg = require(parentPackage);
    else
        pckg = require('./package');

    //console logs
    let streams = [
        {
            name: 'stdout',
            stream: process.stdout
        }
    ];

    let logPath = (
        process.env.LOG_PATH ? process.env.LOG_PATH :
            path.join(__dirname, '../../../logs')
    );

    if(existsSync(logPath) === false)
        mkdirSync(logPath);

    if(process.env.LOG_FILE === false || process.env.LOG_FILE === 'false'){
        streams.push({
            type: 'rotating-file',
            path: path.join(logPath, (process.env.LOG_FILENAME ? process.env.LOG_FILENAME : 'main.log')),
            period: (process.env.LOG_FILEROTATION ? process.env.LOG_FILEROTATION : '1h'), // daily rotation
            count: intOrDefault(process.env.LOG_FILECOUNT, 24) // keep n back copies
        });
    }

    logger = bunyan.createLogger({
        name: (pckg.name ? pckg.name : 'prodig-standard-logger'),
        streams,
        serializers: bunyan.stdSerializers
    });

    //Set log level according to environment
    if(process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'){
        logger.level('debug');
    }
    else if(process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'stag')
    {
        logger.level('info');
    }
    else if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'){
        logger.level('warn');
    }
}
catch(ex){
    console.error(ex);
    throw ex;
}

module.exports = logger;