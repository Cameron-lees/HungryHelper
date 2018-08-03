const opencage = require('opencage-api-client');
const prompt = require('prompt');
const figlet = require('figlet');
const chalk = require('chalk');

console.log(
  chalk.yellow(
    figlet.textSync('HUNGRY HELPER', { horizontalLayout: 'full' })
  )
);

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyB5guxjAu-zyYRkKzdnFBpYd4tDledXtwY'
});

var credentials = {
    properties: {
      address: {
        description: 'Enter Address (Street Address, City, Province)',
        hidden: false,
        required: true
      }
    }
  };

prompt.start();

(async() => {
    var result = await new Promise(function (resolve, reject) {
        prompt.get(credentials, function (err, result) {
            resolve(result);
            //console.log(result);
        });
    });

var location = result.address;

opencage.geocode({q: location}).then(data => {
  if (data.status.code == 200) {
    if (data.results.length > 0) {
      var place = data.results[0];
      //console.log(place.formatted);
      //console.log(place.geometry);
        googleMapsClient.placesNearby({
          location: place.geometry,
          radius: 1000,
          keyword: "restaurant",
          rankby: 'prominence'
        }, function(err, response) {
          if (!err) {
            for(var i = 0; i < 11; i++){
            //console.log(chalk.white.bold("Restaurant:", i+1));
            if (i == 0) {
              console.log("");
              console.log(chalk.white.bold("Nearby Restaurants:"));
          }
            console.log(chalk.red(response.json.results[i].name));
            console.log(chalk.white(response.json.results[i].vicinity));
            console.log(chalk.white(response.json.results[i].rating));

            if (i == 10) {
              console.log("");
              console.log(chalk.white.bold("More Info:"));
          }

            googleMapsClient.place({
              placeid: response.json.results[i].place_id,
              fields: ['name', 'formatted_phone_number', 'opening_hours', 'website']
            }, function(err, response) {
              if (!err) {
                console.log(chalk.red(response.json.result.name));
                console.log(chalk.white(response.json.result.formatted_phone_number));
                for (var x = 0; x < 6; x++)
                {
                  var obj = response.json.result.opening_hours.weekday_text[x];
                  console.log(obj);
                }
                console.log(chalk.white(response.json.result.website));
                console.log("");
              }
                //console.log(response.json.results);
              });
            } // end for loop
          }
        }); //end placeNearby function
      }
    }
}).catch(error => {
  console.log('error', error.message); });
})();
