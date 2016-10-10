# Damla Cay Project Data Collection #

## General To-Do ##

- Figure out what to use for version control & repo
	- whatever I want :P
- How is the web app being served? Is there a backend?
	- Currently static files.
- What technology is used for coding?
	- Currently an html file with embedded JS that displays the google map.
- Language support

## Facebook Events ##
### What Data Do We Want ###
- A list of events happening in Istanbul
- Atendee data about events
- Info about events
### Useful Sources ###
- [https://github.com/tobilg/facebook-events-by-location-core/blob/master/lib/eventSearch.js](https://github.com/tobilg/facebook-events-by-location-core/blob/master/lib/eventSearch.js)
### Method Outline ###
- Query *places* by location
	- Syntax: https://graph.facebook.com/[version]/search?type=place&q=[query]&center=[latitude, longitude]&distance=[distance]&limit=[limit]1000"&fields=id"&access_token=[accessToken]
	- With lang, lng, distance data
	- Is this going to be fixed or changing (ie with zoom level)
		- all events in istanbul first
		- then events will be filtered out by location
- Query 'events' by places
	- Syntax: https://graph.facebook.com/[version]/ids[idArray]&access_token=[access token]&fields=[fields].since([since]).until([until])
	- With place and start/end times
	- How are we going to set the times?
		- initially 1 week, then sometime in the coming month as the user uses the filter
		- no past events for now
- Extract event description, venue, time

### What Do I Need ###
- Access token

## People Density ##
### What Data Do We Want ###
- Density of people per  location
### Useful Sources ###
- [https://www.mapbox.com/blog/twitter-map-every-tweet/](https://www.mapbox.com/blog/twitter-map-every-tweet/)
### Method Outline ###
- Auth (complicated :( )
	-[https://dev.twitter.com/oauth/overview/authorizing-requests](https://dev.twitter.com/oauth/overview/authorizing-requests)
- Get statuses of people
	- Syntax: https://stream.twitter.com/1.1/statuses/filter.json?track=[track]&locations=[locations] etc.
	- With locations data (Istanbul)
		- find lat, lng pair representing Istanbul [https://dev.twitter.com/streaming/overview/request-parameters#locations](https://dev.twitter.com/streaming/overview/request-parameters#locations)
- Filter excessive tweets
	-  Example: [https://github.com/ericfischer/geotools/blob/master/cleanse.c](https://github.com/ericfischer/geotools/blob/master/cleanse.c)
	-  Tweets from same location
	-  Tweets by the same user within a specific distance (ie 250ft)
	-  Banding in iPhone's- each unique lat, lng appear only once
	-  Eric Fischer stated that when this filtering is applied ~9% of tweets appear on the map, are we OK with that?
	- Filtering won't be applied at first, will be tested out as the project goes on
- Timing
	- initially tweets from the past 15 minutes will be taken into consideration, this might change
	- a system should be designed to convey this information
		- will the data be written and stored in a file?
		- should we use a web socket to communicate with front-end?
- Visualization
	- Different types of data should be returned for trying out different visualization techniques
		- ie for location the number of people who tweeted at that location can be returned
		- or an entry can be returned for each place.
### What Do I Need ###
- Access token (done)

## Weather Data ##
### Some Questions ###
- How often are we going to get weather data?
	- Forecasts are available by minute, hour, day
		- Minute by minute for the next hr, hour for next 2 days, day for the next week
	- new query per user or store the data in backend
	- we can also get the current weather data
- By what units will we  require the forecast?
	- First the current weather for a general location
	- Then more specific weather data as the user zooms in

### API ###
 [Dark Sky API](https://darksky.net/dev/) seems to be well-liked.

- It is free for the first 1000 (wont be  a problem if we store the data) then it is pay as you go
- supports turkish as well as english
- I don't know yet what distance radius is covered by each request
- If we use this API we need to include a reference to it.
- If we are going to use Air Pollution Data from OpenWeatherMap (see below) we might consider getting weather data from there as well.

- more details:
	- alerts returned in the forecast request, could be useful?

## Air Pollution Data ##
- Example: [http://aqicn.org/map/turkey/#@g/41.0632/29.0178/12z](http://aqicn.org/map/turkey/#@g/41.0632/29.0178/12z)
- Their data is not publicly available, for turkey they take the data from goverment ([havaizleme.gov.tr](havaizleme.gov.tr) and they take it from cevre bakanligi)
	- To use the same data we need to parse the website (not recommended)
	- Or request the data from the government (might be hard?)

- Other data sources are available
	- [Open Weather Map](openweathermap.org)
		- Air pollution data is dependent on CO and O3 values
		- It can be queried with lat,lng and date,time
		- Syntax for O3: http://api.openweathermap.org/pollution/v1/o3/[location]/[datetime].json?appid=[api_key]
		- [Reference for O3](http://openweathermap.org/api/pollution/o3)
		- Syntax for CO: Syntax for O3: http://api.openweathermap.org/pollution/v1/co/[location]/[datetime].json?appid=[api_key]
		- [Reference for CO](http://openweathermap.org/api/pollution/co)
		- We need to subscribe for this (min plan is 40$  per month)
	- Ozone data is also available from DarkSky (see above)
