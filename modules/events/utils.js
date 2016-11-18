var eventConstants = require("./constants");

function formatEvents (events, eventMapping, api) {
  var processedEvents = [];

  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    processedEvents.push(formatEvent(event, eventMapping));
  }

  return processedEvents;
}

function formatEvent (event, eventMapping) {
  var fields = eventConstants.eventFields;

  var eventObj = {
    api: eventMapping.api
  };

  fields.forEach(function (field) {
    var mappedField = eventMapping[field];
    if (mappedField) {
      eventObj[field] = resolveProperty(event, mappedField);
    } else {
      eventObj[field] = "";
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
