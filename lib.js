'use strict';

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
            //log.error('ex ' + ex);
            rej(ex);
        }
    });
};

/**
 * Taken from https://stackoverflow.com/a/14794066 and customized
 * @param value to check if valid integer
 * @param defValue default value if it is no valid integer
 * @return {number} valid integer, returns 0 if no value was given as default
 */
let intOrDefault = function(value, defValue = 0){
    if (isNaN(value)) {
        return defValue;
    }
    var x = parseFloat(value);

    if((x | 0) === x) return value;

    return defValue;
};

module.exports = { requestAsync, intOrDefault };