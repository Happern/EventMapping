//TODO read these from a file
var fbApp = {
  appId: "1792234597730953",
  appSecret: "a483d1758fb31296df2954608cda0312",
  accessToken: "1792234597730953|psmJHqdDocDXjcbc4GZVvBAZ6EM"
};

function setAccessToken (token) {
  console.log("old value is", values.accessToken);
  values.accessToken = token;
  console.log("token changed to", values.accessToken);
}

function getFieldsForEventSearch () {
  var eventsFields = [
    "id",
    "type",
    "name",
    "description",
    "place",
    "category",
    "start_time",
    "end_time",
    "attending_count",
    "declined_count",
    "maybe_count",
    "noreply_count"
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

module.exports = {
  fbApp: fbApp,
  getFieldsForEventSearch: getFieldsForEventSearch,
  setAccessToken: setAccessToken
};
