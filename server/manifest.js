'use strict';

const Dotenv = require('dotenv');
const Confidence = require('confidence');
const Toys = require('toys');
const Boom = require('boom');

// Pull .env into process.env
Dotenv.config({ path: `${__dirname}/../.env` });

// Glue manifest as a confidence store
module.exports = new Confidence.Store({
    server: {
        host: 'localhost',
        port: {
            $filter: { $env: 'NODE_ENV' },
            $default: {
                $env: 'PORT',
                $coerce: 'number',
                $default: 3000
            },
            test: { $value: undefined }         // Let the server find an open port
        },
        debug: {
            $filter: { $env: 'NODE_ENV' },
            $default: {
                log: '*',
                request: '*'
            },
            production: {
                log: ['error'],
                request: ['error']
            }
        }
    },
    register: {
        plugins: [
            {
                plugin: '../lib', // Main plugin
                options: {
                    jwtKey: {
                        $filter: { $env: 'NODE_ENV' },
                        $default: {
                            $env: 'APP_SECRET',
                            $default: 'app-secret'
                        },
                        production: {           // In production do not default to "app-secret"
                            $env: 'APP_SECRET'
                        }
                    }
                }
            },
            {
                plugin: {
                    $filter: { $env: 'NODE_ENV' },
                    $default: 'hpal-debug',
                    production: Toys.noop
                }
            },
            {
                plugin: 'schwifty',
                options: {
                    $filter: { $env: 'NODE_ENV' },
                    $default: {},
                    $base: {
                        migrateOnStart: true,
                        knex: {
                            client: "pg",
                            migrations: {
                                stub: 'lib/migrations/templates/defaultMigrationTemplate.js'
                            },
                            connection: {
                                database: {
                                    $env: 'DB_NAME',
                                },
                                host: {
                                    $env: 'DB_HOST'
                                },
                                user: {
                                    $env: 'DB_USER'
                                },
                                password: {
                                    $env: 'DB_PASS'
                                },
                                requestTimeout: 90000,
                                connectionTimeout: 30000,
                                acquireConnectionTimeout: 30000,
                                typeCast: function(field, next) {
                                // Convert 1 to true, 0 to false, and leave null alone
                                if (field.type === 'TINY' && field.length === 1) {
                                    const value = field.string()
                                    return value ? value === '1' : null
                                }
                                return next()
                                }
                            },
                            pool: {
                                min: 4,
                                max: 10
                            }
                        }
                    },
                    production: {
                        migrateOnStart: false
                    }
                }
            },
            {
                plugin: './plugins/swagger'
            },
        ]
    }
});
