var path = require('path');
var fs = require('fs');

var Promise = require('es6-promise').Promise;

var findSimulators = require('node-firefox-find-simulators');
var findPorts = require('node-firefox-find-ports');
var connect = require('node-firefox-connect');
var installApp = require('node-firefox-install-app');
var findApp = require('node-firefox-find-app');
var launchApp = require('node-firefox-launch-app');
var uninstallApp = require('node-firefox-uninstall-app');

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

exports.pushApp = function (client) {

    var appPath = path.join(path.dirname(path.dirname(__dirname)), 'www');
    var manifest = JSON.parse(fs.readFileSync(appPath + '/manifest.webapp'));

    // TODO: replace most of this with node-firefox-push-app when it exists
    // https://github.com/mozilla/node-firefox/issues/37
    return findApp({
        client: client,
        manifest: manifest
    }).then(function(apps) {
        return Promise.all(apps.map(function (app) {
          return uninstallApp({
              client: client,
              manifestURL: app.manifestURL
          });
        }));
    }).then(function(uninstalled) {
        return installApp({
            client: client,
            appPath: appPath
        });
    }).then(function(result) {
        return findApp({
            client: client,
            manifest: manifest
        });
    }).then(function(apps) {
        return launchApp({
            client: client,
            manifestURL: apps[0].manifestURL
        });
    });
}
