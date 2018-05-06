//Basic Node js application

let config = require("dotenv").config();
let keys = require('./keys.js');
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);
let Twitter = require("twitter");
let client = new Twitter(keys.twitter);
let fs = require('fs');
let logger = fs.createWriteStream('log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
});

let request = require("request");

let command = process.argv[2];
'use strict';
let inquirer = require("inquirer");
switch (command){

    case 'my-tweets' :

        logger.write('Appending ' + command + ' command by node js console\n');
        //show you at leasr the last 20 tweets
        let params = {
            q: '#nodejs, #Nodejs', //search query
            count: 20, //number of tweets to return
            screen_name: 'nodejs',
            result_type: 'recent', //shows recent tweets
            lang: 'en' //language English
        };

        client.get('search/tweets', params, function (error, tweets, response) {
            if (!error) {
                console.log('--------------------TWITTER REPORT--------------------');
                for (let i = 0; i < tweets.statuses.length; i++) {
                    let id = { id: tweets.statuses[i].id_str };
                    let text = { text: tweets.statuses[i].text };
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

            let dataArr = data.split("\n");
            let song = '';
            let myArgs = process.argv.slice(2);
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

        let info = {};
        let movies = [];

        inquirer.prompt([
            {
                name: "name",
                type: "list",
                message: "Enter the movie you want to watch?",
                choices: movies,
                filter: function(val) {
                    return val.test(/^[a-zA-Z_\s]+$/);
                }
            }
        ]).then(answers => {
            console.log(JSON.stringify(answers, null, '  '));
            movies.forEach(function(track){
                if (answer.name !== '') {
                    info = {
                        titles: movies
                    };
                }
                else {
                    info = {
                        titles: 'Mr. Nobody.',
                        year: 2009
                    };
                }
            });
            console.log('list of songs: ' + tracks)

        }).catch(function(err){
            console.log(err);
        });

        let queryURL = "https://www.omdbapi.com/?t=" + '"' + info.titles + '"' + "&y=&plot=short&apikey=" + keys.omdb.apikey;
        if (queryURL !== '') {
            request(queryURL, function (error, response, body) {
                console.log('statusCode:', response.statusCode); // Print the response status code if a response was received  
                if (error) {
                    logger.write('Error ocurred for movie-this command: ' + error + '\n');
                    return console.error(error);
                }
                let movie = JSON.parse(body);
                
                console.log('--------------------IMDB REPORT--------------------');
                // console.log(body);
                console.log('Title: ' + movie.Title);
                console.log('Year: ' + movie.Year);
                console.log('Ranking: ' + movie.imdbRating);
                console.log('Rooten Tomatoes: ' +  movie.Ratings);
                console.log('Country(%s) and language(%s)', movie.Country, movie.Language[0]);
                console.log('Synopsis: ' + movie.Plot);
                console.log('actors: ', movie.Actors);
                console.log('--------------------END IMDB REPORT--------------------');
            });
        }
        break;
    
    case 'do-what-it-says':

        logger.write('Appending ' + command + ' command by node js console\n');

        let allLines = fs.readFileSync('random.txt').toString().split('\n');
        console.log('songs: ' + allLines);
        allLines.forEach(function (item) {
            let chunk = item.substring(18);
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