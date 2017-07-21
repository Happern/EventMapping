function processData(weatherDataObject, fields) {
    var processed = {};
    fields.forEach(function (field){
      if (weatherDataObject[field]) {
          processed[field] = weatherDataObject[field];
      }     
    })

    return processed;
}

function checkErrors (resp) {
  if (resp.error && resp.error === "1") {
    return resp.description;
  }

  return null;
}

module.exports = {
  processData: processData
}
