var apiKeys = require("../../apiKeys");
var apiName = "meetup";

module.exports = {
  apiKey: apiKeys.meetup.apiKey,
  apiName: apiName,
  eventFormatMapping: {
    api: apiName,
    id: "id",
    name: "name",
    description: "description",
    venue_name: "venue.name",
    category: "group.who",
    photo: "photo_album.photo_sample",
    lat: "venue.lat",
    lng: "venue.lon",
    start_time: "time",
    attending: "yes_rsvp_count",
    waitlist: "waitlist_count",
    link: "link"
  }
}
