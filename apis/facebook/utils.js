function extractEvents (placeEventData) {
  var events = [];
  var placeIds = Object.keys(placeEventData);

   var numPlaces = placeIds.length;
   for (var placeIndex = 0; placeIndex < numPlaces; placeIndex++) {
      var data = placeEventData[placeIds[placeIndex]];

      if (data.events) {
        //TODO check if the event is really happening in Istanbul
        events = events.concat(data.events.data);
      }
   }

   return events;
}

function processValues (values) {
  var numValues = values.length;
  var events = [];
  for(var valueIndex = 0; valueIndex < numValues; valueIndex++) {
      events = events.concat(extractEvents(values[valueIndex]));
  }

  return events;
}

module.exports = {
  processValues: processValues,
  extractEvent: extractEvents
}
