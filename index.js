// Ninja Blocks driver for The Thing System
// (c) 2013 Don Coleman

var util = require('util'),
    stream = require('stream'),
    thingsystem = require('./lib/thingsystem');

/**
 * Called when ninja block loads the driver
 * @constructor
 *
 * @param  {Object} opts Saved/default driver configuration
 * @param  {Object} app  The app event emitter
 *
 */
function NinjaThingDriver(opts, app) {
    'use strict';

    app.log.info('NinjaBlocks driver for The Thing System (c)2013 Don Coleman');

    app.on('device::up', function(guid, device) {

        if (device && device.V === 0 && (device.D === 30 || device.D === 31)) {
            app.log.info('Registering ' + guid + ' for The Thing System notification');

            device.on('data', function(value) {
                var unit = device.D === 30 ? '%' : '\u00B0C';
                app.log.info('Received ' + value + unit + ' from device ' + device.G);

                thingsystem.sendReport(device, value, function(err) {
                    if (err) {
                        app.log.error('Error sending message ' + err);
                    }
                });

            });
        }
    });

}

// Give the driver a stream interface
util.inherits(NinjaThingDriver, stream);

module.exports = NinjaThingDriver;
