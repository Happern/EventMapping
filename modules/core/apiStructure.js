var eventFields = require("../events/constants").eventFields;

var host = process.env.EM_DOMAIN;

if (!process.env.PORT) {
  var port = process.env.EM_PORT || 5000;
  host += ":" + port;
}
module.exports = {
  "swagger": "2.0",
  "info": {
    "description": "Documentation for Event Mapping Server App.",
    "version": "0.0.1",
    "title": "EventMapping API",
    "contact": {
      "email": "sinem93@gmail.com"
    },
    "license": {
      "name": "MIT",
      "url": "https://github.com/swagger-api/swagger-ui/blob/master/LICENSE"
    }
  },
  "host": host,
  "basePath": "/",
  "produces": ["application/json"],
  "consumes": ["application/json"],
  "schemes": [
    "http"
  ],
  "definitions": {
    "DensityResponseModel": {
      "type": "object",
      "properties": {
        "api": {
          "type": "string"
        },
        "data": {
          "$ref": "#/definitions/DensityArrayModel"
        }
      },
      "required": [
        "api",
        "data"
      ]
    },
    "DensityArrayModel" : {
      "type": "array",
      "items": {
        "$ref": "DensityItemModel"
      }
    },
    "DensityItemModel" : {
      "type": "object",
      "properties": {
        "lat": {
          "type": "number"
        },
        "lng": {
          "type": "number"
        }
      },
      "required": [
        "lat",
        "lng"
      ]
    },
    "WeatherResponseModel": {
      "type": "object",
      "properties": {
        "api": {
          "type": "string"
        },
        "data": {
          "$ref": "#/definitions/WeatherArrayModel"
        }
      },
      "required": [
        "api",
        "data"
      ]
    },
    "WeatherArrayModel" : {
      "type": "array",
      "items": {
        "$ref": "WeatherItemModel"
      }
    },
    "WeatherItemModel" : {
      "type": "object",
      "properties": {
        "latitude": {
          "type": "number"
        },
        "longitude": {
          "type": "number"
        },
        "apparentTemperature": {
          "type": "number"
        },
        "windSpeed": {
          "type": "number"
        },
        "precipProbability": {
          "type": "number"
        }
      },
      "required": [
        "latitude", "longitude", "apparentTemperature", "windSpeed", "precipProbability"
      ]
    },
    "EventRequestModel": {
      "type": "object",
      "properties": {
        "since": {
          "type": "string"
        },
        "until": {
          "type": "string"
        }
      }
    },
    "EventResponseModel": {
      "type": "object",
      "properties": {
        "api": {
          "type": "string"
        },
        "data" : {
          "$ref": "#/definitions/EventArrayModel"
        }
      },
      "required": [
        "api", "data"
      ]
    },
    "EventArrayModel": {
      "type": "array",
      "items": {
        "schema": {
          "$ref": "#/definitions/EventModel"
        }
      }
    },
    "EventModel": {
      "type": "object",
      "properties" : {
        "api": {
          "description": "API from which event data is taken from",
          "type": "string"
        },
        "id": {
          "type": "string"
        },
        "name": {
          "description": "name of the event",
          "type": "string"
        },
        "description": {
          "description": "description of the event",
          "type": "string"
        },
        "venue_name": {
          "description": "name of the venue the event is hosted in",
          "type": "string"
        },
        "lat": {
          "description": "latitude of the event",
          "type": "number"
        },
        "lng": {
          "description": "longitude of the event",
          "type": "number"
        },
        "category": {
          "type": "string"
        },
        "photo": {
          "type": "any"
        },
        "start_time": {
          "type": "string"
        },
        "end_time": {
          "type": "string"
        },
        "attending": {
          "type": "number"
        },
        "maybe": {
          "type": "number"
        },
        "interested": {
          "type": "number"
        },
        "waitlist": {
          "type": "number"
        },
        "link": {
          "description": "Url of a location where more info about the event can be found",
          "type": "string"
        }
      },
      "required": eventFields
    }
  },
  "paths": {
    "/density": {
      "post": {
        "tags": ["Get Density"],
        "description": "Returns the density of people in Istanbul for the past 15 mins",
        "responses": {
          "200": {
            "description": "Successfully got density",
            "schema": {
              "$ref": "#/definitions/DensityResponseModel"
            }
          }
        }
      }
      },
    "/weather/current": {
      "post": {
        "tags": ["Get Current Weather"],
        "description": "Returns the current weather for the coordinates if given, or for pre-determined coordinates in Istanbul",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Coordinates for which the weather data is requested",
            "required": false,
            "schema": {
              "type": "object",
              "properties": {
                  "coords": {
                    "type": "string"
                  }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully got the weather data",
            "schema": {
              "$ref": "WeatherResponseModel"
            }
          }
        }
      }
    },
    "/meetup": {
      "post": {
        "tags": ["Get Meetup Events"],
        "description": "Returns events from Meetup. If no time interval is specified, events in the coming week are returned",
        "parameters" : [
          {
            "name": "body",
            "in": "body",
            "description": "Defines the time interval",
            "required": false,
            "schema": {
              "$ref": "#/definitions/EventRequestModel"
            }
        }
      ],
      "responses": {
        "200": {
          "description": "Successfully got events",
          "schema": {
            "$ref": "#/definitions/EventResponseModel"
          }
        }
      }
      }
    },
    "/eventful": {
      "post": {
        "tags": ["Get Eventful Events"],
        "description": "Returns events from Eventful. If no time interval is specified, events in the coming week are returned",
        "parameters" : [
          {
            "name": "body",
            "in": "body",
            "description": "Defines the time interval",
            "required": false,
            "schema": {
              "$ref": "#/definitions/EventRequestModel"
            }
        }
      ],
      "responses": {
        "200": {
          "description": "Successfully got events",
          "schema": {
            "$ref": "#/definitions/EventResponseModel"
          }
        }
      }
      }
    },
    "/facebook/" : {
      "post": {
        "tags": ["Get Facebook Events"],
        "description": "Returns events from Facebook. If no time interval is specified, events in the coming week are returned",
        "parameters" : [
          {
            "name": "body",
            "in": "body",
            "description": "Defines the time interval",
            "required": false,
            "schema": {
              "$ref": "#/definitions/EventRequestModel"
            }
        }
        ],
        "responses": {
          "200": {
            "description": "Successfully got events",
            "schema": {
              "$ref": "#/definitions/EventResponseModel"
            }
          }
        }
      }
    },
    "/events" : {
      "post": {
        "tags" : ["Get Events"],
        "description": "Returns events from Facebook, Eventful, Meetup API's in the specified time interval. If no time interval is specified, events in the coming week are returned",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Defines the time interval",
            "required": false,
            "schema": {
                "$ref": "#/definitions/EventRequestModel"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully got events",
            "schema": {
              "$ref": "#/definitions/EventResponseModel"
            }
          }
        }
      }
    }
  }
}
