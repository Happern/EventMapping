module.exports = {
  update: {
    interval: 2 * 60 * 1000 //in ms
  },
  date: {
    defaultFormat: "DD/MM/YYYY",
    localTimeFormat: "YYYY-MM-DDTHH:mm:SS"
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
