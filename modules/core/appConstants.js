module.exports = {
  timeValues: {
    updateInterval: 5 * 60 * 1000, //in ms
    timeout: 10 * 1000
  },
  date: {
    defaultFormat: "DD/MM/YYYY",
    localTimeFormat: "YYYY-MM-DDTHH:mm:SS",
    eventfulFormat: "YYYYMMDD00",
    meetupFomat: "YYYY-MM-DDTHH:mm:ss.SSSZ"
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
