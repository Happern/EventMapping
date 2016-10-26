var moment = require("moment");
var dateConstants = require("../../modules/core/appConstants").date;

function filterResultsByDate (events, startMoment, endMoment) {
  var startStamp = startMoment.format("x");
  var endStamp = endMoment.format("x");
  
  return events.filter(function(event) {
    return event.time >= startStamp && event.time <= endStamp;
  });
}


//TODO all api data will need this to be corrected, move to a general location
function correctTimeFormat (events) {
  events.forEach(function (event) {
    event.time  = moment(event.time).format(dateConstants.defaultFormat);
  })
}

function extractQueryParamsFromLink (link) {
  var path = link.split(";")[0];
  var extracted = path.slice(1, path.length - 1).split("?")[1];
  return extracted;
}

function checkDate(string, endMoment) {
  //TODO make it more general, very limited to current forwarding format
  var unneccessaryPart = "scroll=since:";
  var decoded = decodeURIComponent(string);
  var date = decoded.split("&")[0].replace(unneccessaryPart, "").split("!")[0];
  return (moment(date, dateConstants.meetupFormat).diff(endMoment) <= 0);
}

module.exports = {
  filterResultsByDate: filterResultsByDate,
  correctTimeFormat: correctTimeFormat,
  extractQueryParamsFromLink: extractQueryParamsFromLink,
  checkDate: checkDate
}
