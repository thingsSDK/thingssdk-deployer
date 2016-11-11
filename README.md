# thingsSDK Deployer

Deploys JavaScript code to microcontrollers using build and upload strategies.

## Installation

```bash
$ npm install thingssdk\thingssdk-deployer
```

## Example Code

If you have you're own JavaScript runtime and you want to build you're own deployment strategy here's an example way

```javascript

const devices = {
    devices: {
        COM7: {
            runtime: "microjs",
            baud_rate: 115200
        }
    }
};

const payload: {
    entry: "index.js"
};

const createDeployer = require('thingssdk-deployer');
const deployer = createDeployer();

deployer.prepare(devices, payload);
//Build Process
deployer.use('microjs', (devices, payload, next) => {
    someTranspileFunction(payload.entry, (err, code) => {
        payload.code = code;
        next();
    });
});
//Upload Process
deployer.use('microjs', (devices, payload, next) => {
    someUploadFunction(devices, payload.code, (err) => {
        next();
    });
});

deployer.deploy();

```

##Current Strategies

* [thingssdk-espruino-strategy](https://github.com/thingsSDK/thingssdk-espruino-strategy)
