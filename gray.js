let logger = require('gelf-pro'),
    path = require('path'),
    {existsSync} = require('fs');
let { intOrDefault }  = require('./lib');

//Try to get parents app name
let pckg;
let parentPackage = path.join(__dirname, '../../../package.json');
let parentPackageExists = existsSync(parentPackage);
if(parentPackageExists)
    pckg = require(parentPackage);
else
    pckg = require('./package');

//Enable graylog intentionally
if(process.env.GRAY_ENABLED === "true"){
    logger.setConfig({
        host: process.env.GRAY_HOST || '127.0.0.1',
        adapterName: process.env.GRAY_ADAPTER || 'tcp',
        fields: {
            name: (pckg.name ? pckg.name : 'prodig-standard-logger'),
            env: process.env.NODE_ENV || 'test'
        },
        filter: [
            function (message) { // rejects a "debug" message
                if(message.level > 5){
                    return process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';
                }
                else if(message.level === 5){
                    return process.env.NODE_ENV === 'stag' || process.env.NODE_ENV === 'staging';
                }
                else
                    return true;
            }
        ],
        adapterOptions: { // this object is passed to the adapter.connect() method
            // common
            host: process.env.GRAY_HOST || '127.0.0.1', // optional; default: 127.0.0.1
            port: intOrDefault(process.env.GRAY_PORT, 12201) // optional; default: 12201
        }
    });
}

module.exports = logger;