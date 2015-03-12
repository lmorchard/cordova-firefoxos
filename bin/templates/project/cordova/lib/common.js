var findSimulators = require('node-firefox-find-simulators');

exports.collectSimulatorVersions = function() {
    // There can be multiple Firefox installations, each with their own set of
    // FxOS simulator addons. But, they're only unique by version. So, this
    // just collects versions.
    return findSimulators().then(function(simulators) {
        var versions = {};
        simulators.forEach(function(simulator) {
            versions[simulator.version] = true;
        });
        return Object.keys(versions).sort();
    });
};
