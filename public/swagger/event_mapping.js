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
          "schema": {
            "$ref": "#/definitions/EventArrayModel"
          }
        }
      }
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
        },
        "start_time": {
          "type": "string"
        },
        "end_time": {
          "type": "string"
        },
        "attending_count": {
          "type": "number"
        },
        "maybe_count": {
          "type": "number"
        },
        "interested_count": {
          "type": "number"
        },
        "waitlist_count": {
          "type": "number"
        },
        "link": {
          "description": "Url of a location where more info about the event can be found",
          "type": "string"
        }
      }
    }
  },
  "paths": {
    "/density": {
      "post": {
        "tags": ["Get Density"],
        "descriptions": "Returns the density of people in Istanbul for the past 15 mins",
        "notes": "Notes",
        "summary": "summary",
        "responses": {
          "200": {
            "description": "Successfully got density",
            "schema": {
              "type":  "array",
              "items": {
                "type": "array",
                "items": {
                  "type": "number"
                }
              }
            }
          }
        }
      }
      },
    "/weather/current": {
      "post": {
        "tags": ["Get Current Weather"],
        "descriptions": "Returns the current weather for the coordinates if given, or for pre-determined coordinates in Istanbul",
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
              "type": "object",
              "properties": {
                "api": {
                  "type": "string"
                },
                "data": {
                  "type": "array",
                  "items": {
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/meetup": {
      "post": {
        "tags": ["Get Meetup Events"],
        "descriptions": "Returns events from Meetup. If no time interval is specified, events in the coming week are returned",
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
        "descriptions": "Returns events from Eventful. If no time interval is specified, events in the coming week are returned",
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
        "descriptions": "Returns events from Facebook. If no time interval is specified, events in the coming week are returned",
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
        "descriptions": "Returns events from Facebook, Eventful, Meetup API's in the specified time interval. If no time interval is specified, events in the coming week are returned",
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
