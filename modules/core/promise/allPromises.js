var appConstants = require("../appConstants");

function combinePromisesTimeout (promiseObjs, successCallback, errorCallback) {
    var allPromises = Promise.all(promiseObjs);
    var resolved = false;

    var resolvedPromises = [];
    setPromiseCollection(promiseObjs, resolvedPromises);

    allPromises.then(function (values) {
      if (!resolved) {
        successCallback(values);
        resolved = true;
      }
    }).catch(function (error) {
      errorCallback(error);
    });


    setTimeout(function () {
      if (!resolved) {
        successCallback(resolvedPromises);
        resolved = true;
      }
    }, appConstants.timeValues.timeout);
}

function setPromiseCollection(promiseObjs, resolvedPromises) {

  promiseObjs.forEach( function (promise) {
    promise.then(function (value) {
      resolvedPromises.push(value);
    }).catch(function (error) {
      //TODO implement, do sth
    });
  });
}

module.exports = {
  combinePromisesTimeout: combinePromisesTimeout
}
