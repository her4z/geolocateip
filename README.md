# geolocateip

Geolocate IP Address App

Before all of this!!:
-$npm install

For running the app in Docker container:
-$docker build -f Dockerfile -t [imageTag] .
-$docker run -it -p [port]:8080 [imageTag]

For running the app in production mode:
-$npm run serve

For running the app in devolpment mode:
-$npm run start
-$npm run server-dev

API:

/geolocateIP/{ip}:
  Get the ip's location data.
  
  Example response:
    {
    {"ip":"8.8.8.8","country_name":"United States","country_code":"US","languages":["English"],"currency":"USD ($1 USD = $1 USD)","timezones":["16:33:7 (UTC- 12:00)","17:33:7 (UTC-11:00)","18:33:7 (UTC-10:00)","19:33:7 (UTC-09:00)","20:33:7 (UTC-08:00)","21:33:7 (UTC-07:00)","22:33:7 (UTC-06:00)","23:33:7 (UTC-05:00)","00:33:7 (UTC-04:00)","14:33:7 (UTC+10:00)","16:33:7 (UTC+12:00)"],"distance_from_ba":"8702.04kms from (40.5369987487793,-82.12859344482422) to Buenos Aires (-34.603722, -58.381592)"}
    }

/averageAPICall:
  Get the average distance of all the distances from Buenos Aires to the locations requested, in kilometres.
  
  Example Response:
    7737.73

/farestAPICall:
  Get the farest distance of all the distances from Buenos Aires to the locations requested, in kilometres
  
  Example Response:
    {"country_name":"Australia","kms_from_ba":11614.85,"calls":1}
 
/nearestAPICall:
 Get the nearest distance of all the distances from Buenos Aires to the locations requested, in kilometres.
 
 Example Response:
  {"country_name":"Argentina","kms_from_ba":3.39,"calls":1}
