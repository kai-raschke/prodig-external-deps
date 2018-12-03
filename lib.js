'use strict';

const log       = require('./log');
const request = require('request');

let requestAsync = async function(options){
    return new Promise((res, rej) => {
        try{
            request(options,
                function (error, response, body) {
                    if (error) {
                        rej(error)
                    }

                    res({response, body});
                });
        }
        catch(ex){
            log.error('ex ' + ex);
            rej(ex);
        }
    });
};

module.exports = { requestAsync };