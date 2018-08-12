// import
import { CONFIG_DARK_SKY } from '../config/env'
import DarkSkyApi from 'dark-sky-api';

// configure
DarkSkyApi.apiKey = CONFIG_DARK_SKY.API_KEY;
DarkSkyApi.units = 'si'; // default 'us'
DarkSkyApi.language = 'de'; // default 'en'
DarkSkyApi.postProcessor = (item) => { // must accept weather data item param
  // add a nice date representation using moment.calender
  item.dayNice = item.dateTime.calendar(null, {
    sameDay: '[Today]',
    nextDay: 'ddd',
    nextWeek: 'ddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] ddd',
    sameElse: 'ddd'
  });

  // add units object onto item
  item.units = DarkSkyApi.getResponseUnits(); // this would be outdated if you changed api units later

  return item; // must return weather data item
};

// use 
DarkSkyApi.loadCurrent()
  .then(data => console.log(data)); // Today

export const DarkSkyApiData = {
    "data": DarkSkyApi.loadCurrent()
    .then(data => console.log(data))
}