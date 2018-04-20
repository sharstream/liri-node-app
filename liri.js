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

        client.get('search/tweets', params, function (error, tweets, response) {
            if (!error) {
                console.log('--------------------TWITTER REPORT--------------------');
                for (var i = 0; i < tweets.statuses.length; i++) {
                    var id = { id: tweets.statuses[i].id_str };
                    var text = { text: tweets.statuses[i].text };
                    console.log('recent tweets: ' + id['id'] + 'tweet: ' + text['text']);
                }
                console.log('--------------------END TWITTER REPORT--------------------');
            } else {
                console.log(error);
                logger.write('Error ocurred for twitter-api command: ' + err + '\n');
            }
        });
        break;

    case 'spotify-this-song' :
        
        logger.write('Appending ' + command + ' command by node js console\n');
        
        fs.readFile("random.txt", "utf8", function (error, data) {
            
            // If the code experiences any errors it will log the error to the console.
            if (error) {
                logger.write('Inside spotify-api debug log: ' + error + '\n');
                return console.log(error);
            }

            var dataArr = data.split("\n");
            var song = '';
            var myArgs = process.argv.slice(2);
            if (myArgs.length === 1) {
                song = 'The Sign';
            }
            else {
                song = process.argv.slice(3);
            }
            
            spotify
                .search({ type: 'track', query: song, limit: 1 })
                .then(function (data, response) {
                    const element = data.tracks.items[0];
                    console.log('--------------------SPOTIFY REPORT--------------------');
                    console.log('Artist(s): ' + element.album.artists[0].name);
                    console.log("The track name is: " + element.name);
                    console.log('A preview link of the song from Spotify is: ' + element.preview_url);
                    console.log('The album name is: ' + element.album.name);
                    console.log('--------------------END SPOTIFY REPORT--------------------');
                    fs.appendFileSync("random.txt", 'spotify-this-song' + ', ' + '"' + element.name + '"' + "\n");
                })
                .catch(function (err) {
                    console.log('Error occurred: ' + err);
                    logger.write('Error ocurred for spotify-this-song command: ' + err + '\n');
                });
        });
        break;

    case 'movie-this' :

        logger.write('Appending ' + command + ' command by node js console\n');
        var info = {};

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

        request(queryURL, function (error, response, body) {
            console.log('statusCode:', response.statusCode); // Print the response status code if a response was received  
            if (error) {
                logger.write('Error ocurred for movie-this command: ' + error + '\n');
                return console.error(error);
            }
            var movie = JSON.parse(body);
            console.log('--------------------IMDB REPORT--------------------');
            console.log('%s (%d) %d/10', movie.Title, movie.Year, movie.imdbRating);
            console.log('Rooten Tomatoes %s', movie.Ratings[1]['Value']);
            console.log('Country(%s) and language(%s)', movie.Country, movie.Language[0]);
            console.log('Synopsis: ' + movie.Plot);
            console.log('actors: ', movie.Actors);
            console.log('--------------------END IMDB REPORT--------------------');
        });
        break;
    
    case 'do-what-it-says':

        logger.write('Appending ' + command + ' command by node js console\n');

        var allLines = fs.readFileSync('random.txt').toString().split('\n');
        console.log('songs: ' + allLines);
        allLines.forEach(function (item) {
            var chunk = item.substring(18);
            song = chunk;
            console.log('song: ' + song);
            if (song !== '') {
                spotify
                    .search({ type: 'track', query: song, limit: 1 })
                    .then(function (data, response) {
                        const element = data.tracks.items[0];
                        console.log('--------------------EACH TRACK--------------------');
                        console.log('Artist(s): ' + element.album.artists[0].name);
                        console.log("The song's name is: " + element.name);
                        console.log('A preview link of the song from Spotify is: ' + element.preview_url);
                        console.log('The album name is: ' + element.album.name);
                        console.log('--------------------END OF EACH TRACK--------------------');
                    })
                    .catch(function (err) {
                        console.log('Error occurred: ' + err);
                        logger.write('Error ocurred for do-what-it-says command: ' + err + '\n');
                    });
            }
        });
        break;

    default:
        console.log('Sorry, we are out of ' + command + '.');
}

logger.end();