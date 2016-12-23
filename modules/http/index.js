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
        //be careful about the format
        checkErrorsSuccess(chunk, resp, config);
      }
    });

    resp.on('end', () => {
      if (!config.isChunked) {
        if (config.expectJSON) {
          data = parseJSON(data, config);

          if (data === null) {
            onInternalError(config.errorCallback);
          }
        }

        checkErrorsSuccess(data, resp, config);
      } else {
        makeRequest(config);
      }
    });
  });

  req.on('error', (e) => {
    if (config.expectJSON) {
      e = parseJSON(e, config);

      if (e === null) {
        onInternalError(config.errorCallback);
      }
    }
  });

  // write data to request body
  if (config.postData) {
    console.log("writing", config.postData);
    req.write(config.postData);
  }

  req.end();
};

function checkErrorsSuccess(data, resp, config) {
  //be careful about json format
  var errMsg;
  //console.log("check errors success called")

  //TODO check errors will be implemented for all api's remove this check
  if(config.checkErrors){
     errMsg = config.checkErrors(data);
  }

  if(errMsg) {
    onAPIError(errMsg, config.errorCallback, config.api);
  } else if (config.successCallback) {
    if(config.requireHeaders && resp.headers) {
      config.successCallback(data, resp.headers);
    } else {
      config.successCallback(data);
    }
  }
}


function onInternalError (errorCallback) {
  if (errorCallback) {
    errorCallback({
      type: "Internal",
      message: "JSON parse error, unexpected format in API response"
    });
  }
}

function onAPIError (errMsg, errorCallback, api) {
  if (errorCallback) {
    errorCallback({
      type: "API",
      api: api,
      message: errMsg
    });
  }
}

function parseJSON (data, config) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

module.exports = {
  makeRequest: makeRequest
}
