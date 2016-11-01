##Check out a Running Instance##
A running version of this app can be found at [event-mapping.herokuapp.com](event-mapping.herokuapp.com)
- For post endpoint docs see [here](event-mapping.herokuapp.com/swagger)
- For the test page (using websocket) see [here](event-mapping.herokuapp.com/test)

Since error handling is not yet implemented fully, the server might crash time to time. Please let me know in that case.

##Running Locally##

If you want to run this in your own computer:
- Make sure you have node and npm installed. You can refer [here](https://nodejs.org/en/) for more information.
- Get relevant API keys for the API's used in the app. First create apps, then get the information listed below:
  - [Facebook](https://developers.facebook.com/): app id, app secret, access token.
  - [Twitter](https://dev.twitter.com/): access token, access token secret, consumer key, consumer secret.
  - [Meetup](https://www.meetup.com/meetup_api/): api key.
  - [Eventful](http://api.eventful.com/): application key.
  - [DarkSky](https://darksky.net/dev/): secret key.
- Set environment variables:
  - EM_KEYS is required as it allows the app to make calls to API's. You will need the information you have acquired in the previous step for this. The format can be found in [sampleApiKeys.json](https://github.com/Happern/EventMapping/blob/master/sampleApiKeys.json) file. Once you have the required data in the specified format, you can stringify the JSON object ([this](http://www.httputility.net/json-minifier.aspx) can be useful) and set the key's value to the resulting string.
  - EM_DOMAIN is another required environment variable. If you are going to run the app locally, you can set it to 'localhost', otherwise set it to the domain the app is going to be served in.
  - EM_PORT is an optional environment variable. If you want the app to served in a specific port you can set it with this variable. The default port is 5000.
  - PORT is another environment variable you can set the port with. It takes precedence over EM_PORT and is used because some deployment platforms set this value by default (ie Heroku). However, if you are going to set the port value yourself, I recommend you to use the EM_PORT variable since PORT is very generic.
- Download the contents of the repo.
- Go to the app directory via a commandline tool.
- Run `npm install`.
- Run `npm start`.

Your app should be running!
To test the app here is what you can do:
- Check out the swagger documentation [domain]:[port]/swagger for post endpoints.
- Check out the test page and socket connection [domain]:[port]/test
- If you use chrome you can download and install [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) and test the post endpoints there.
