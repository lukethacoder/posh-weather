import React, { Component } from 'react'
import userData from '../config/user-data'

class DarkSkyAPI extends React.Component {
    render() {
        $.getJSON(["https://api.darksky.net/forecast/" + DARK_SKY.API_KEY + "/" + userData.lat + "," + userData.lon + ], function(forecast) {
            console.log(forecast);
        });
        function loadData(url) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (xhttp.readyState == 4 && xhttp.status == 200) {
                 console.log(xhttp.responseText);
              }
            };
            xhttp.open("GET", url, true);
            xhttp.send();
          }
          loadData()
        return (
            <p>
                {forecast}
            </p>
        )
    }
}

export default DarkSkyAPI