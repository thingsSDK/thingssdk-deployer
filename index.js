'use strict';

module.exports = function createDeployer() {

    const runtimeStrategies = {

    };

    let _payload;
    let _devices;

    function checkPrepareForTypeErrors(devices, payload) {
        if (typeof devices !== 'object') {
            throw new Error('prepare() requires a devices object');
        } else if (typeof payload !== 'object') {
            throw new Error('prepare() requires a payload object');
        }
    }

    function checkUseForTypeErrors(runtime, strategyFunction) {
        if (typeof runtime !== 'string') {
            throw new Error('use() requires a runtime string');
        } else if (typeof strategyFunction !== 'function') {
            throw new Error('use() requires a strategy function');
        }
    }


    function generateNext(next, func) {
        return (err) => {
            if (err) throw err;
            func(_devices, _payload, next);
        };
    }

    function addStrategyFunctionToRuntimeQueue(runtime, strategyFunction) {
        if (runtimeStrategies[runtime] === undefined) {
            runtimeStrategies[runtime] = [];
        }

        runtimeStrategies[runtime].push(strategyFunction);
    }

    function executeQueue(queue) {
        const queueReversed = queue.slice().reverse();
        const go = queueReversed.reduce(generateNext, (()=>{}));
        go();
    }

    function use(runtime, strategyFunction) {
        checkUseForTypeErrors(runtime, strategyFunction);
        addStrategyFunctionToRuntimeQueue(runtime, strategyFunction);
    }

    function deploy(onEndHandler = () => {}) {
        const runtimes = Object.keys(runtimeStrategies);
        runtimes.forEach(runtime => {
            runtimeStrategies[runtime].push(() => onEndHandler(runtime));
            executeQueue(runtimeStrategies[runtime]);
        });
    }

    function prepare(devices, payload) {
        checkPrepareForTypeErrors(devices, payload);
        _devices = devices;
        _payload = payload;
    }
    return {
        use,
        deploy,
        prepare
    };
};