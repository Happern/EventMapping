var https = require("https");

function makeRequest (config) {
  var req = https.request(config.options, (resp) => {
    var status = resp.statusCode;

    var data = "";
    resp.setEncoding('utf8');

    resp.on('data', (chunk) => {
      if (!config.isChunked) {
        data += chunk;
      } else {
        config.successCallback(chunk);
      }
    });

    resp.on('end', () => {
      if (!config.isChunked) {
        if (config.expectJSON) {
          data = JSON.parse(data);
        }

        if (config.errorCodes && config.errorCodes.indexOf(status) >= 0) {
          var errorMessage = constructErrorMessage(data, "problem with request",
          config.errorMessageField);
          onError(data, errorMessage, config.errorCallback);
        } else if (config.successCallback) {
          if(config.requireHeaders) {
            config.successCallback(data, resp.headers);
          } else {
            config.successCallback(data);
          }
        }
      } else {
        makeRequest(config);
      }
    });
  });

  req.on('error', (e) => {
    if (config.expectJSON) {
      e = JSON.parse(e);
    }

    var errorMessage = constructErrorMessage(e, "problem with request",
    config.errorMessageField)

    onError(e, errorMessage, config.errorCallback);
  });

  // write data to request body
  if (config.postData) {
    console.log("writing", config.postData);
    req.write(config.postData);
  }

  req.end();
};

function constructErrorMessage(resp, defaultMessage, errorMessageField) {
  var errorMessage = defaultMessage;

  if (errorMessageField) {
    var errorFieldComponents = errorMessageField.split(".");
    var errorFieldDepth = errorFieldComponents.length;
    var currLevel = resp;

    for (var depth = 0; depth < errorFieldDepth; depth++) {
      currLevel = currLevel[errorFieldComponents[depth]];
    }

    errorMessage += ", " + currLevel;
  }

  return errorMessage;
}

function onError (resp, message, errorCallback) {
  if (errorCallback) {
    errorCallback(resp);
  }
}

module.exports = {
  makeRequest: makeRequest
}
