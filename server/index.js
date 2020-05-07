const Glue = require('@hapi/glue');
const Manifest = require('./manifest');
const cron = require("node-cron");
const CONSTANTS = require('../lib/constants');

// taking mode of node environment from .env file.
const Dotenv = require('dotenv')
Dotenv.config({ path: `${__dirname}/../.env` });

exports.deployment = async (start) => {

    const manifest = Manifest.get('/');
    const server = await Glue.compose(manifest, { relativeTo: __dirname });

    // Printing a request log
    server.events.on('response', function (request) {
        request.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
    });


    await server.initialize();  

    if (!start) {
        return server;
    }

    await server.start();
    


    console.log(`Server started at ${server.info.uri}`);

    return server;
};

if (!module.parent) {
    try {
        if (process.env.NODE_ENV) {
            exports.deployment(true);
            process.on('unhandledRejection', (err) => {
                console.log(err);
                throw err;
            });       
        } else {
            throw Error("An environment variable needs to be defined.")
        }
    } catch (err) { // if mode is not defiend then inform to user defined mode.
        console.log( "Please defined Node Environment mode either development or production in .env file")
        throw err
    }
}
