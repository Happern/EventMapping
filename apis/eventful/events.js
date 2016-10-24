var makeEventfulRequest = require("./index").makeEventfulRequest;
var appConstants = require("../../modules/core/appConstants");
var x2js = require('x2js');

function getEventsInIstanbul () {
  var istanbulCenter = appConstants.geo.istanbul.center;

  var queryParams = {
    where: istanbulCenter.lat + "," + istanbulCenter.lng,
    within: 25 //TODO experiment with the radius
  };

  var path = "/events/search";
  var parser = new x2js();

  return new Promise(function (resolve, reject){
    makeEventfulRequest(path, queryParams, function (resp) {
      resolve(parser.xml2js(resp));
    }, function (err) {
      reject(err);
    })
  });
}

module.exports = {
  getEventsInIstanbul: getEventsInIstanbul
}
