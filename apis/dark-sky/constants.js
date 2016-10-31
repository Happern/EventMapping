var apiKeys = require("../../apiKeys.json");

module.exports = {
  secretKey: apiKeys.darkSky.secretKey,
  weatherFields: [
    "apparentTemperature", "windSpeed", "precipProbability"
  ],
  generalFields: [
    "latitude", "longitude"
  ],
  istanbulCoords: [ //TODO replace with real coordinates
    "41.17762034,28.97575378",
    "41.05760863,28.7752533",
    "41.03378714,28.87275696",
    "41.04000227,29.07600403",
    "41.10212132,29.15290833",
    "41.12591806,29.26002502"
  ]
}
