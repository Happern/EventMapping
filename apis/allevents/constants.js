var apiKeys = require("../../apiKeys");
var apiName = "allevents";

module.exports = {
  apiName: apiName,
  primaryKey: apiKeys.allEvents.primaryKey,
  secondaryKey: apiKeys.allEvents.secondaryKey,
  eventFormatMapping: {
    api: apiName,
    id: "event_id",
    name: "eventname",
    venue_name: "location",
    lat: "venue.latitude",
    lng: "venue.longitude",
    photo: "thumb_url",
    start_time: "start_time",
    end_time: "end_time",
    link: "event_url",
    category: "categories"
  }
}
