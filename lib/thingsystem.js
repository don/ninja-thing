/*jshint unused: vars */
'use strict';
// Ninja Blocks driver for The Thing System
// (c) 2013-4 Don Coleman

var dgram = require('dgram'),
    startTime = new Date().getTime(),
    requestId = 0;

// This should be user specific config
var sensorNames = {
    '0101': 'Outside',
    '0102': 'TV Room',
    '0103': 'Kitchen',
    '0104': 'Bedroom',
    '0201': 'Office'
};

// Translate NinjaBlock device into The Thing System sensor data format
var toSensorData = function(device, value) {
    var sensor = {};
    sensor.name = sensorNames[device.G] || device.G;
    sensor.status = 'present';

    // ninjablocks sees temperature(31) and humidity(30) as 2 separate sensors
    // they are combined into one sensor when reporting to the thing system
    sensor.unit = {
        serial: device.G,
        udn: "ninjablocks:temperature:humidity:" + device.G
    };

    sensor.info = {};
    if (device.D === 30) {
        sensor.info.humidity = value;
    } else if (device.D === 31) {
        sensor.info.temperature = value;
    } else {
        sensor.info[device.D] = value;
    }

    // instead of uptime, is there a way we can add device.last_data.timestamp?
    sensor.uptime = new Date().getTime() - startTime;

    return sensor;
};

// Create TSRP message with the sensor data
var createMessage = function(sensorData) {
    requestId++;

    var message = {};
    message.path = '/api/v1/thing/reporting';
    message.requestID = requestId.toString();
    message.things = {
        '/device/climate/ninjablocks/sensor': { 
            prototype: {
                device: {
                    name: 'Ninja.Block.Temperature.and.Humidity.Sensor',
                    maker: 'Ninja.Blocks'
                },
                name: true,
                status: ['present', 'absent', 'recent'],
                properties: {
                    temperature: 'celsius',
                    humidity: 'percentage'
                }
            },
            instances: [ sensorData ]
        }
    };

    return message;
};

// sends the TSRP message via UDP multicast
var sendMessage = function(message, callback) {

    var buffer = new Buffer(JSON.stringify(message), 'UTF-8');
    var client = dgram.createSocket('udp4');

    client.send(buffer, 0, buffer.length, 22601, '224.0.9.1', function(err, bytes) {
        if (err) {
            console.log('Error Sending UDP broadcast ' + err);
        }
        client.close();

        if (callback) { callback(err); }
    });
};

module.exports = {
    sendReport: function(device, value, callback) {
        var sensorData = toSensorData(device, value),
            message = createMessage(sensorData);

        sendMessage(message, callback);
    }
};
