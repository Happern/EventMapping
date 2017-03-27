function getRandomValue(fieldname) {
  var value;
  switch(fieldname) {
    case 'event_type': value = getRandomEventTypeValue(); break;
    case 'capacity': value = getRandomCapacityValue(); break;
    case 'people_density': value = getRandomPeopleDensityValue(); break;
    case 'sound': value = getRandomSoundValue(); break;
    case 'activity': value = getRandomActivityValue(); break;
    case 'price': value = getRandomPriceValue(); break;
    case 'event_language': value = getRandomEventLanguageValue(); break;
    default: value = "";
  }
  return value;
}

function getRandomEventTypeValue() {
  var categoryProb = Math.random();
  var subCategoryProb = Math.random();
  var eventType;

  if (categoryProb <= 0.25) {
    if (subCategoryProb <= 0.17) {
      eventType = "Meetup";
    } else if (subCategoryProb <= 0.34) {
      eventType = "Celebration";
    } else if (subCategoryProb <= 0.51) {
      eventType = "Festival";
    } else if (subCategoryProb <= 0.68) {
      eventType = "Party";
    } else if (subCategoryProb <= 0.85) {
      eventType = "Concert";
    } else if (subCategoryProb <= 1) {
      eventType = "Sports Event";
    }
  } else if (categoryProb <= 0.5) {
    if (subCategoryProb <= 0.25) {
      eventType = "Cinema";
    } else if (subCategoryProb <= 0.5) {
      eventType = "Theater";
    } else if (subCategoryProb <= 0.75) {
      eventType = "Show";
    } else if (subCategoryProb <= 1) {
      eventType = "Exhibition";
    }
  } else if (categoryProb <= 0.75) {
    if (subCategoryProb <= 0.25) {
      eventType = "Conference";
    } else if (subCategoryProb <= 0.5) {
      eventType = "Meeting";
    } else if (subCategoryProb <= 0.75) {
      eventType = "Talk";
    } else if (subCategoryProb <= 1) {
      eventType = "Workshop";
    }
  } else if (categoryProb <= 1 ) {
    if (subCategoryProb <= 0.33) {
      eventType = "Protest";
    } else if (subCategoryProb <= 0.66) {
      eventType = "Ceremony";
    } else if (subCategoryProb <= 1) {
      eventType = "Other";
    }
  }
  return eventType;
}

function getRandomSoundValue () {
  var sound = Math.random();
  return sound;
}

function getRandomPriceValue () {
  var priceProb = Math.random();
  var price;
  if (priceProb <= 0.25) {
    price = 0;
  } else if (priceProb <= 0.5) {
    price = 1;
  } else if (priceProb <= 0.75) {
    price = 2;
  } else if (priceProb <= 1) {
    price = 3;
  }
  return price;
}

function getRandomActivityValue() {
  var activity = Math.random();
  return activity;
}

function getRandomEventLanguageValue () {
  var eventLanguageProb = Math.random();
  var eventLanguage;
  if (eventLanguageProb <= 0.5) {
    eventLanguage = "TR";
  } else if (eventLanguage <= 1) {
    eventLanguage = "ENG";
  }
  return eventLanguage;
}

function getRandomPeopleDensityValue () {
  var peopleDensity = Math.random();
  return peopleDensity;
}

function getRandomCapacityValue() {
  var capacity = Math.random();
  return capacity;
}

module.exports = {
  getRandomValue: getRandomValue
};
