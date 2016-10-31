var apiKeys = require("../../apiKeys.json");

var fbApp = apiKeys.facebook;

function setAccessToken (token) {
  console.log("old value is", values.accessToken);
  values.accessToken = token;
  console.log("token changed to", values.accessToken);
}

function getFieldsForEventSearch () {
  var eventsFields = [
    "id",
    "name",
    "description",
    "place",
    "category",
    "cover",
    "start_time",
    "end_time",
    "attending_count",
    "maybe_count",
    "interested_count",
    "ticket_uri"
  ];
  var fields = [
    "id",
    "name",
    "about",
    "emails",
    "cover.fields(id,source)",
    "picture.type(large)",
    "location",
    "events.fields(" + eventsFields.join(",") + ")"
  ];

  return fields;
}

var eventFormatMapping = {
  api: "facebook",
  id: "id",
  name: "name",
  description: "description",
  venue_name: "place.name",
  lat: "place.location.latitude",
  lng: "place.location.longitude",
  start_time: "start_time",
  end_time: "end_time",
  link: "ticket_uri",
  attending_count: "attending_count",
  maybe_count: "maybe_count",
  interested_count: "interested_count",
  photo: "cover"
}

module.exports = {
  fbApp: fbApp,
  getFieldsForEventSearch: getFieldsForEventSearch,
  setAccessToken: setAccessToken,
  eventFormatMapping: eventFormatMapping
};
