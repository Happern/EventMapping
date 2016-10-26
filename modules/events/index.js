var fbEvents = require("../../apis/facebook/events");
var meetupEvents = require("../../apis/meetup/events");
var eventfulEvents = require("../../apis/eventful/events");
var moment = require("moment");
var appConstants = require("../core/appConstants");
var allPromises = require("../core/promise/allPromises");

function getIstanbulEvents (startDate, endDate) {
    var startMoment = startDate ? moment(startDate, appConstants.date.defaultFormat) : moment();
    var endMoment = endDate ? moment(endDate, appConstants.date.defaultFormat): moment().add(1, "w");

    fbPromise = fbEvents.getEventsInIstanbul(startMoment, endMoment);
    meetupPromise = meetupEvents.getEventsInIstanbul(startMoment, endMoment);
    eventfulPromise = eventfulEvents.getEventsInIstanbul(startMoment, endMoment);

    return new Promise(function (resolve, reject) {
      allPromises.combinePromisesTimeout([fbPromise, meetupPromise, eventfulPromise],
      function (values) {
        var resolvedValues = [];

        resolve({
          api: 'all-events',
          data: resolvedValues.concat.apply([], values)
        });
      }, function (error) {
        reject(error);
      });
    });
}

module.exports = {
  getIstanbulEvents: getIstanbulEvents
}
