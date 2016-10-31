var apiKeys = require("../../apiKeys.json");

module.exports = {
  apiKey: apiKeys.meetup.apiKey,
  eventFormatMapping: {
    api: "meetup",
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
