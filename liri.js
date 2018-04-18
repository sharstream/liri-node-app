//Basic Node js application

var config = require("dotenv").config();
var keys = require('./keys.js');
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);
var fs = require('fs');
var logger = fs.createWriteStream('log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
});
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
// Then run a request to the OMDB API with the movie specified
// var Omdb = require('omdb');
// var omdb = new Omdb(keys.omdb);
var request = require("request");

var command = process.argv[2];

switch (command){

    case 'my-tweets' :

        logger.write('Appending ' + command + ' command by node js console\n');
        //show you at leasr the last 20 tweets
        var params = {
            q: '#nodejs, #Nodejs', //search query
            count: 20, //number of tweets to return
            screen_name: 'nodejs',
            result_type: 'recent', //shows recent tweets
            lang: 'en' //language English
        };
        console.log(params);
        client.get('search/tweets', params, function (error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.statuses.length; i++) {
                    var id = { id: tweets.statuses[i].id_str };
                    var text = { text: tweets.statuses[i].text };
                    console.log('recent tweets: ' + id['id'] + 'tweet: ' + text['text']);
                }
            } else {
                console.log(error);
                logger.write('Inside twitter-api debug log: ' + err + '\n');
            }
        });
        break;

    case 'do-what-it-says':
    case 'spotify-this-song' :
        
        logger.write('Appending ' + command + ' command by node js console\n');
        var allLines = fs.readFileSync('random.txt').toString().split('\n');
        fs.readFile("random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                logger.write('Inside spotify-api debug log: ' + error + '\n');
                return console.log(error);
            }

            // We will then print the contents of data
            console.log(data);

            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");
            var song = '';
            // We will then re-display the content as an array for later use.
            console.log('Arrays of songs: ' + dataArr);
            console.log('allLines: ' + allLines);

            if (process.argv[3] !== '') {
                song = process.argv[3];
            }
            else if (dataArr.lenght > 0 && command === 'do-what-it-says') {
                song = dataArr[1];
            }
            else {
                song = 'The Sign';
            }
            console.log('Song >>>>>> ' + song);
            spotify
                .search({ type: 'track', query: song, limit: 1 })
                .then(function (data, response) {
                    // console.log(JSON.stringify(data, null, 2));
                    console.log('length: ' + data.tracks.items.length);
                    for (let i = 0; i < data.tracks.items.length; i++) {
                        const element = data.tracks.items[i];
                        console.log('Artist(s): ' + element.album.artists[0].name);
                        console.log("The song's name is: " + element.name);
                        console.log('A preview link of the song from Spotify is: ' + element.preview_url);
                        console.log('The album name is: ' + element.album.name);
                        fs.appendFileSync("random.txt", 'spotify-this-song' + ', ' + '"' + element.name + '"' + "\n");
                    }
                })
                .catch(function (err) {
                    console.log('Error occurred: ' + err);
                    logger.write('Error ocurred for spotify-api: ' + err + '\n');
                });
        });
        break;

    case 'movie-this' :

        logger.write('Appending ' + command + ' command by node js console\n');
        var info = {};
        // API URL: http://www.omdbapi.com/?i=tt3896198&apikey=omdb

        if (process.argv[3] !== '') {
            info = {
                title: process.argv[3]
            };
        }
        else {
            info = {
                title: 'Mr. Nobody.',
                year: 2009
            };
        }

        var queryURL = "https://www.omdbapi.com/?t=" + info.title + "&y=&plot=short&apikey=" + keys.omdb.apikey;
        // console.log('keys: ' + keys.omdb);
        request(queryURL, function (error, response, body) {
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received  
            // if (response.statusCode === '200') {
            console.log('body:', JSON.parse(body)); // Print the HTML for the Google homepage.
            if (error) {
                logger.write('Error ocurred for omdb-api: ' + error + '\n');
                return console.error(error);
            }
            var movie = JSON.parse(body);

            console.log('%s (%d) %d/10', movie.Title, movie.Year, movie.imdbRating);
            console.log('Rooten Tomatoes %s', movie.Ratings[1]['Value']);
            console.log('Country(%s) and language(%s)', movie.Country, movie.Language[0]);
            console.log(movie.Plot);
            console.log('actors: ', movie.Actors);
        });
        break;

    default:
        console.log('Sorry, we are out of ' + command + '.');
}

logger.end();