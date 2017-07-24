module.exports = {
  timeValues: {
    updateInterval: 15 * 60 * 1000, //in ms
    timeout: 4 * 1000
  },
  date: {
    defaultFormat: "DD/MM/YYYY",
    localTimeFormat: "YYYY-MM-DDTHH:mm:SS",
    eventfulFormat: "YYYYMMDD00",
    meetupFomat: "YYYY-MM-DDTHH:mm:ss.SSSZ",
    allEventsFormat: "DD-MM-YYYY"
  },
  dateTime: {
    eventful: "YYYY-MM-DD HH:mm:SS",
    meetup: "x",
    allevents: "X",
    facebook: "YYYY-MM-DDTHH:mm:SSZZ",
    default: "DD/MM/YYYY HH:mm:SS"
  },
  geo: {
    istanbul: {
      center: {
        lat: "41.015137",
        lng: "28.979530"
      },
      boundingBoxSW: {
        lat: "40.896322",
        lng: "28.516388"
      },
      boundinBoxNE: {
        lat: "41.339120",
        lng: "29.439240"
      }
    }
  }
}
