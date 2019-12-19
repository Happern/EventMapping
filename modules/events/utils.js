var moment = require("moment");
var eventConstants = require("./constants");
var appConstants = require("../core/appConstants");
var randomize = require("./randomize");
var defaultFormat = appConstants.dateTime.default;

function formatEvents (events, eventMapping) {
  var processedEvents = [];
  var api = eventMapping.api;
  var apiTimeFormat = appConstants.dateTime[api];
  if (events !== null || events !== undefined) {
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      processedEvents.push(formatEvent(event, eventMapping, apiTimeFormat));
    }
  }

  return processedEvents;
}

function formatEvent (event, eventMapping, originalFormat) {
  var fields = eventConstants.eventFields;

  var eventObj = {
    api: eventMapping.api
  };

  fields.forEach(function (field) {
    var mappedField = eventMapping[field];
    if (mappedField) {
      var value = resolveProperty(event, mappedField);
      if (field === "start_time" || field === "end_time") {
        if (value) {
          value = moment(value, originalFormat).format(defaultFormat);
        } else {
          value = "";
        }
      }
      eventObj[field] = value;
    } else {
      eventObj[field] = randomize.getRandomValue(field);
    }
  });

  return eventObj;
}

function resolveProperty(obj, property) {
  var currValue;

  if (property.indexOf(".")>=0 ) {
    var propertyHierarchy = property.split(".");
    var hierarchyDepth = propertyHierarchy.length;
    currValue = obj;
    var currField;

    for (var depth = 0; depth < hierarchyDepth; depth++) {
      if (currValue == undefined) {
        currValue = "";
        break;
      } else {
        currField = propertyHierarchy[depth];
        currValue = currValue[currField];
      }
    }
  } else {
    currValue = obj[property] || "";
  }

  return currValue;
}

module.exports = {
  formatEvents: formatEvents
};
