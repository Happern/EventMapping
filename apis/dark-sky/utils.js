function processData(weatherDataObject, fields) {
    var processed = {};
    fields.forEach(function (field){
      processed[field] = weatherDataObject[field];
    })

    return processed;
}

module.exports = {
  processData: processData
}
