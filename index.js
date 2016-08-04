'use strict';

class Deployer {
    constructor() {
        this.runtimes = {};
    }

    addToRuntime(runtime, key, value) {
        var newRuntimeObject = {};
        newRuntimeObject[key] = value;
        this.runtimes[runtime] = Object.assign(newRuntimeObject, this.runtimes[runtime]);
    }
    
    build(runtime, builder) {
        builder((err, code) => {
            if(err) {
                console.error(err);
            } else {
                this.runtimes[runtime].uploader(code);
            }
        });
    }

    upload(runtime, uploader) {
        this.addToRuntime(runtime, "uploader", uploader);
    }
}

module.exports = () => new Deployer();