'use strict';
const {assert} = require('chai');

describe('deployer', () => {
    const devices = {
        devices: {
            COM7: {
                runtime: "espruino",
                baudrate: 115200
            }
        }
    };
    const payload = { entryPoint: 'main.js' };

    describe('prepare()', () => {
        let deployer;
        beforeEach(() => {
            deployer = require('../')();
        });

        it('should take a devices object and payload object', () => {
            const valid = () => deployer.prepare(devices, payload);
            const invalid = () => deployer.prepare("", "");
            const anotherInvalid = () => deployer.prepare(devices, "");

            assert.doesNotThrow(valid, Error);
            assert.throws(invalid, Error);
            assert.throws(anotherInvalid, Error);
        });
    });

    describe('use()', () => {
        let deployer;
        beforeEach(() => {
            deployer = require('../')();
        });

        it('should accept a runtime string and strategy function', () => {
            const valid = () => deployer.use('espruino', () => { });
            const invalid = () => deployer.use(() => { }, 'espruino');
            const anotherInvalid = () => deployer.use('espruino', 'espruino');

            assert.doesNotThrow(valid, Error);
            assert.throws(invalid, Error);
            assert.throws(anotherInvalid, Error);
        });
    });

    describe('deploy()', () => {
        let deployer;
        beforeEach(() => {
            deployer = require('../')();
        });

        it('should run all runtime strategy functions in order for each runtime', () => {
            let orderExecuted = {
                espruino: [],
                kinoma: []
            };

            deployer.prepare(devices, payload);

            deployer.use('espruino', (devices, payload, next) => {
                orderExecuted.espruino.push(1);
                next();
            });


            deployer.use('kinoma', (devices, payload, next) => {
                orderExecuted.kinoma.push(3);
                next();
            });

            deployer.use('espruino', (devices, payload, next) => {
                orderExecuted.espruino.push(2);
                next();
            });

            deployer.use('kinoma', (devices, payload, next) => {
                orderExecuted.kinoma.push(4);
                next();
            });

            deployer.deploy();
            assert.deepEqual(orderExecuted.espruino, [1, 2]);
            assert.deepEqual(orderExecuted.kinoma, [3, 4]);
        });
    });
});