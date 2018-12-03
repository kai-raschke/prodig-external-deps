'use strict';
const bunyan = require('bunyan'),
    path = require('path'),
    {mkdirSync, existsSync} = require('fs');
let logger, streams = [];

try{
    //Try to get parents app name
    let pckg;
    let parentPackage = path.join(__dirname, '../../package.json');
    let parentPackageExists = existsSync(parentPackage);
    if(parentPackageExists)
        pckg = require(parentPackage);
    else
        pckg = require('./package');

    //console logs
    streams.push(
        {
            name: 'stdout',
            stream: process.stdout
        }
    );

    let logPath = path.join(__dirname, '../../logs');
    try{
        mkdirSync(logPath);
    }
    catch(ex){
        //console.error(ex);
        //probably already exists
    }

    streams.push({
        type: 'rotating-file',
        path: path.join(logPath, (process.env.LOG_FILENAME ? process.env.LOG_FILENAME : 'main.log')),
        period: (process.env.LOG_FILEROTATION ? process.env.LOG_FILEROTATION : '1h'), // daily rotation
        count: (isNaN(parseInt(process.env.LOG_FILECOUNT)) ? 24 : parseInt(process.env.LOG_FILECOUNT)) // keep n back copies
    });

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
}

module.exports = logger;