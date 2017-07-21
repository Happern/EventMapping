function processData(weatherDataObject, fields) {
    if (weatherDataObject !== null) {
      isFieldNull = false
      var processed = {};
      fields.forEach(function (field){
        if (weatherDataObject[field]) {
            processed[field] = weatherDataObject[field];
        } else {
          isFieldNull = true
        }
      })

      if (isFieldNull) {
        console.log(weatherDataObject)
      }
    } else {
      console.log(weatherDataObject)
    }
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
