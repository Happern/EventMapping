var apiKeys = require("../../apiKeys");
var apiName = "eventful";

module.exports = {
  applicationKey: apiKeys.eventful.applicationKey,
  apiName: apiName,
  eventFormatMapping: {
    api: apiName,
    id: "id",
    name: "title",
    description: "description",
    venue_name: "venue_name",
    lat: "latitude",
    lng: "longitude",
    start_time: "start_time",
    end_time: "stop_time",
    link: "url"
  }
};
